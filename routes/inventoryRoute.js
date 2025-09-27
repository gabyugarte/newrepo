// Needed Resources 
const express = require("express");
const router = new express.Router() ;
const invController = require("../controllers/invController");
const utilities = require("../utilities")

// Route to build inventory by classification id
router.get("/type/:classificationId", invController.buildByClassificationId);
// Vehicle detail route
router.get("/detail/:inv_id", invController.buildByInvId)
//error route
router.get("/cause-error", invController.causeError)
// Inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement))


module.exports = router;
