const utilities = require("./");
const invModel = require("../models/inventory-model");

const classificationVal = {};

/* ***************************
 * Check classification data
 * ************************** */
classificationVal.checkClassificationData = async (req, res, next) => {
  try {
    const { classification_name } = req.body;
    
    // Validate classification name is not empty
    if (!classification_name || classification_name.trim() === '') {
      req.flash("notice", "Please provide a classification name.");
      return res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav: await utilities.getNav(),
        errors: null,
        flashMessage: req.flash("notice"),
        classification_name: ""
      });
    }
    
    // Validate no spaces or special characters
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(classification_name)) {
      req.flash("notice", "Classification name cannot contain spaces or special characters.");
      return res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav: await utilities.getNav(),
        errors: null,
        flashMessage: req.flash("notice"),
        classification_name: ""
      });
    }
    
    // Check if classification already exists
    const classifications = await invModel.getClassifications();
    const exists = classifications.find(classification => 
      classification.classification_name.toLowerCase() === classification_name.toLowerCase()
    );
    
    if (exists) {
      req.flash("notice", "Classification name already exists.");
      return res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav: await utilities.getNav(),
        errors: null,
        flashMessage: req.flash("notice"),
        classification_name: ""
      });
    }
    
    // Si pasa todas las validaciones, continuar
    next();
    
  } catch (error) {
    console.error("Error in classification validation:", error);
    next(error); // Pasar el error al siguiente middleware de errores
  }
};

module.exports = classificationVal;