const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ***************************
 *  Middleware: Verify JWT and role
 * ************************** */
const checkEmployeeOrAdmin = (req, res, next) => {
  const token = req.cookies.jwt

  if (!token) {
    req.flash("notice", "You must be logged in to access that page.")
    return res.redirect("/account/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    // Solo Admin o Employee pueden continuar
    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      res.locals.accountData = decoded
      next()
    } else {
      req.flash("notice", "You are not authorized to access that area.")
      res.redirect("/account/login")
    }
  } catch (error) {
    console.error("JWT verification failed:", error)
    req.flash("notice", "Please log in again.")
    res.redirect("/account/login")
  }
}

module.exports = checkEmployeeOrAdmin
