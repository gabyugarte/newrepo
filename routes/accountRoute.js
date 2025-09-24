// routes/accountRoute.js
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

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


module.exports = router
