// routes/accountRoute.js
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

/* ***************************
 *  GET Login view
 * ************************** */
router.get(
  "/login", 
  utilities.handleErrors(accountController.buildLogin)
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



module.exports = router
