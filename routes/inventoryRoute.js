// Needed Resources 
const express = require("express");
const router = express.Router();  // <-- Cambia "new express.Router()" por esto
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation")


// IMPORTANTE: Importa los middlewares de validación SOLO si los archivos existen
let classificationVal, inventoryVal;

try {
    classificationVal = require("../utilities/classification-validation");
} catch (error) {
    console.log("classification-validation.js not found, using simple validation");
    classificationVal = { checkClassificationData: (req, res, next) => next() };
}

try {
    inventoryVal = require("../utilities/inventory-validation");
} catch (error) {
    console.log("inventory-validation.js not found, using simple validation");
    inventoryVal = { checkInventoryData: (req, res, next) => next() };
}

// Route to build inventory by classification id
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Vehicle detail route
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInvId));

// Error route
router.get("/cause-error", utilities.handleErrors(invController.causeError));

// Inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// TASK 2: Add Classification Routes - SIMPLIFICADO TEMPORALMENTE
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Ruta POST simplificada - sin middleware de validación por ahora
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

// TASK 3: Add Inventory Routes - SIMPLIFICADO TEMPORALMENTE
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

router.post(
  "/add-inventory",
  inventoryVal.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)
// Route to edit inventory item
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))
router.post("/update", utilities.handleErrors(invController.updateInventory))

// Update Inventory Route
router.post(
  "/update",
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)


module.exports = router;