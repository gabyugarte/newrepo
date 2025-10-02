// routes/accountRoute.js
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

/* ***************************
 *  GET Login view
 * ************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ***************************
 *  GET Registration view
 * ************************** */
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

/* ***************************
 *  POST Registration process
 * ************************** */
router.post(
  "/register",
  regValidate.registrationRules(),  // reglas de validación
  regValidate.checkRegData,         // chequea errores y stickiness
  utilities.handleErrors(accountController.registerAccount) // controlador
)

// Default route for account management
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)
// Deliver edit account view
router.get(
  "/edit",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildEditAccount)
)


module.exports = router
