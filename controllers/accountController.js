const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
console.log("DEBUG -> accountModel:", accountModel)
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    messages: req.flash("notice"),
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    messages: [],
    errors: null,
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // plain password + salt rounds (10 is standard)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }


  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      messages: req.flash("notice")
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      messages: req.flash("notice")
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  try {
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    // 🔑 Comparar contraseñas
    const match = await bcrypt.compare(account_password, accountData.account_password)
    if (!match) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    delete accountData.account_password

 
    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }   // OJO: no milisegundos
    )

    // Guardar cookie
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }

    return res.redirect("/account/")
  } catch (error) {
    console.error("❌ ERROR EN LOGIN:", error)
    req.flash("notice", "Sorry, login failed.")
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
}




/* ****************************************
 *  Deliver account management view
 * ************************************ */

const capitalize = (str) => {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
async function buildAccountManagement(req, res) {
  try {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData || {}

    console.log("DEBUG -> accountData en buildAccountManagement:", accountData)

    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      messages: req.flash("notice"),
      accountData, 
      account_firstname: capitalize(accountData.account_firstname) || "User"
    })
  } catch (error) {
    console.error("Error rendering account management view:", error)
    req.flash("notice", "There was a problem loading your account information.")
    res.redirect("/account/login")
  }
}


async function buildAccountUpdate(req, res) {
  const account_id = req.params.account_id
  const accountData = await accountModel.getAccountById(account_id)
  const nav = await utilities.getNav()

  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id
  })
}

/* **********************************
 *  Handle Account Info Update
 * ********************************* */
async function updateAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
  } else {
    req.flash("notice", "Sorry, the update failed.")
  }

  const nav = await utilities.getNav()
  const updatedAccount = await accountModel.getAccountById(account_id)

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    messages: req.flash("notice"),
    account_firstname: updatedAccount.account_firstname,
    accountData: updatedAccount
  })
}

/* **********************************
 *  Handle Password Change
 * ********************************* */
async function updatePassword(req, res) {
  const { account_password, account_id } = req.body
  const hashedPassword = await bcrypt.hash(account_password, 10)
  const passwordResult = await accountModel.updatePassword(hashedPassword, account_id)

  const nav = await utilities.getNav()

  if (passwordResult) {
    req.flash("notice", "Password updated successfully.")
  } else {
    req.flash("notice", "Password update failed.")
  }

  const updatedAccount = await accountModel.getAccountById(account_id)

  res.render("account/management", {
    title: "Account Management",
    nav,
    messages: req.flash("notice"),
    account_firstname: updatedAccount.account_firstname,
    accountData: updatedAccount
  })
}
/* **********************************
 * Logout
 * ********************************* */
function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}



module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildAccountUpdate, updateAccount, updatePassword, logout }


