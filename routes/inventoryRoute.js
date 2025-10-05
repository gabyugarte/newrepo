// // Needed Resources 
// const express = require("express")
// const router = express.Router()
// const invController = require("../controllers/invController")
// const utilities = require("../utilities")
// const invValidate = require("../utilities/inventory-validation")
// const checkEmployeeOrAdmin = require("../utilities/checkAdmin") 

// // IMPORTANTE: Importa los middlewares de validación SOLO si los archivos existen
// let classificationVal, inventoryVal

// try {
//   classificationVal = require("../utilities/classification-validation")
// } catch (error) {
//   console.log("classification-validation.js not found, using simple validation")
//   classificationVal = { checkClassificationData: (req, res, next) => next() }
// }

// try {
//   inventoryVal = require("../utilities/inventory-validation")
// } catch (error) {
//   console.log("inventory-validation.js not found, using simple validation")
//   inventoryVal = { checkInventoryData: (req, res, next) => next() }
// }

// /* ****************************************
// * PUBLIC ROUTES (accessible to everyone)
// **************************************** */

// // Route to build inventory by classification id
// router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// // Vehicle detail route
// router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInvId))

// // Error route (for testing)
// router.get("/cause-error", utilities.handleErrors(invController.causeError))

// /* ****************************************
// * ADMIN/EMPLOYEE PROTECTED ROUTES
// **************************************** */

// // Inventory management view
// router.get(
//   "/",
//   utilities.checkLogin,             // Verifica que haya sesión activa
//   checkEmployeeOrAdmin,             // Solo Admin/Employee
//   utilities.handleErrors(invController.buildManagement)
// )

// // Add Classification view
// router.get(
//   "/add-classification",
//   utilities.checkLogin,
//   checkEmployeeOrAdmin,
//   utilities.handleErrors(invController.buildAddClassification)
// )

// // Add Classification process
// router.post(
//   "/add-classification",
//   utilities.checkLogin,
//   checkEmployeeOrAdmin,
//   utilities.handleErrors(invController.addClassification)
// )

// // Add Inventory view
// router.get(
//   "/add-inventory",
//   utilities.checkLogin,
//   checkEmployeeOrAdmin,
//   utilities.handleErrors(invController.buildAddInventory)
// )

// // Add Inventory process
// router.post(
//   "/add-inventory",
//   utilities.checkLogin,
//   checkEmployeeOrAdmin,
//   inventoryVal.checkInventoryData,
//   utilities.handleErrors(invController.addInventory)
// )

// // Return inventory list in JSON
// router.get(
//   "/getInventory/:classification_id",
//   utilities.checkLogin,
//   checkEmployeeOrAdmin,
//   utilities.handleErrors(invController.getInventoryJSON)
// )

// // Edit Inventory view
// router.get(
//   "/edit/:inv_id",
//   utilities.checkLogin,
//   checkEmployeeOrAdmin,
//   utilities.handleErrors(invController.editInventoryView)
// )

// // Update Inventory
// router.post(
//   "/update",
//   utilities.checkLogin,
//   checkEmployeeOrAdmin,
//   invValidate.newInventoryRules(),
//   invValidate.checkUpdateData,
//   utilities.handleErrors(invController.updateInventory)
// )

// // Delete confirmation view
// router.get(
//   "/delete/:inv_id",
//   utilities.checkLogin,
//   checkEmployeeOrAdmin,
//   utilities.handleErrors(invController.buildDeleteView)
// )

// // Handle delete
// router.post(
//   "/delete",
//   utilities.checkLogin,
//   checkEmployeeOrAdmin,
//   utilities.handleErrors(invController.deleteInventory)
// )

// module.exports = router

// Needed Resources 
const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")
const checkEmployeeOrAdmin = require("../utilities/checkAdmin") // JWT + Roles

// IMPORTANTE: Importa los middlewares de validación SOLO si los archivos existen
let classificationVal, inventoryVal

try {
  classificationVal = require("../utilities/classification-validation")
} catch (error) {
  console.log("classification-validation.js not found, using simple validation")
  classificationVal = { checkClassificationData: (req, res, next) => next() }
}

try {
  inventoryVal = require("../utilities/inventory-validation")
} catch (error) {
  console.log("inventory-validation.js not found, using simple validation")
  inventoryVal = { checkInventoryData: (req, res, next) => next() }
}

/* ****************************************
* PUBLIC ROUTES (accessible to everyone)
**************************************** */

// Route to build inventory by classification id
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Vehicle detail route
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInvId))

// Error route (for testing)
router.get("/cause-error", utilities.handleErrors(invController.causeError))

/* ****************************************
* ADMIN/EMPLOYEE PROTECTED ROUTES
**************************************** */

// Inventory management view
router.get(
  "/",
  checkEmployeeOrAdmin, // 🛡️ Solo Admin o Employee con JWT válido
  utilities.handleErrors(invController.buildManagement)
)

// Add Classification view
router.get(
  "/add-classification",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

// Add Classification process
router.post(
  "/add-classification",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.addClassification)
)

// Add Inventory view
router.get(
  "/add-inventory",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

// Add Inventory process
router.post(
  "/add-inventory",
  checkEmployeeOrAdmin,
  inventoryVal.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Return inventory list in JSON
router.get(
  "/getInventory/:classification_id",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.getInventoryJSON)
)

// Edit Inventory view
router.get(
  "/edit/:inv_id",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.editInventoryView)
)

// Update Inventory
router.post(
  "/update",
  checkEmployeeOrAdmin,
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Delete confirmation view
router.get(
  "/delete/:inv_id",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteView)
)

// Handle delete
router.post(
  "/delete",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router
