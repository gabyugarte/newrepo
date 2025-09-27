const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}
const utilities = require(".")






/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // Firstname: required, at least 1 char
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // Lastname: required, at least 2 chars
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // Email: required, valid format
    body("account_email")
      .trim()
      .isEmail().withMessage("A valid email is required.")
      .normalizeEmail()
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists > 0) {
          throw new Error("Email exists. Please log in or use a different email.")
        }
        return true
      }),


    // Password: required, must be strong
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters and contain at least 1 number, 1 capital letter, and 1 special character."
      ),
  ]
}

/* ******************************
 * Check data and return errors
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/register", {
      errors: errors.array(), 
      title: "Registration",
      nav,
      account_firstname, 
      account_lastname,
      account_email,
    })
  }
  next()
}

module.exports = validate
