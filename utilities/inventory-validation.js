const { body, validationResult } = require("express-validator")
const utilities = require("./")
const invModel = require("../models/inventory-model")

const inventoryVal = {}

/* ***************************
 * Check inventory data
 * ************************** */
inventoryVal.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  let errors = []

  // Required fields validation
  if (!inv_make?.trim()) errors.push("Make is required.")
  if (!inv_model?.trim()) errors.push("Model is required.")
  if (!inv_year || isNaN(inv_year)) errors.push("Valid year is required.")
  if (!inv_description?.trim()) errors.push("Description is required.")
  if (!inv_price || isNaN(inv_price)) errors.push("Valid price is required.")
  if (!inv_miles || isNaN(inv_miles)) errors.push("Valid miles are required.")
  if (!inv_color?.trim()) errors.push("Color is required.")
  if (!classification_id) errors.push("Classification is required.")

  // Year validation
  if (inv_year && (inv_year < 1900 || inv_year > new Date().getFullYear() + 1)) {
    errors.push("Year must be between 1900 and current year + 1.")
  }

  // Price validation
  if (inv_price && inv_price < 0) errors.push("Price cannot be negative.")

  // Miles validation
  if (inv_miles && inv_miles < 0) errors.push("Miles cannot be negative.")

  if (errors.length > 0) {
    req.flash("notice", "Please correct the following errors:")
    return res.status(400).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav: await utilities.getNav(),
      classificationList: await utilities.buildClassificationList(classification_id),
      errors: errors,
      flashMessage: req.flash("notice"),
      // Sticky form data
      inv_make: inv_make || "",
      inv_model: inv_model || "",
      inv_year: inv_year || "",
      inv_description: inv_description || "",
      inv_image: inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail: inv_thumbnail || "/images/vehicles/no-image-tn.png",
      inv_price: inv_price || "",
      inv_miles: inv_miles || "",
      inv_color: inv_color || "",
      classification_id: classification_id || ""
    })
  }

  next()
}

/* ***************************
 * Check data and return errors for Update Inventory
 * ************************** */
inventoryVal.checkUpdateData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  } = req.body

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`

    return res.render("./inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
  next()
}

/* ***************************
 * Validation Rules for New Inventory
 * ************************** */
inventoryVal.newInventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long."),

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters long."),

    body("inv_year")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Enter a valid year."),

    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),

    body("classification_id")
      .notEmpty()
      .withMessage("Classification is required."),
  ]
}


module.exports = inventoryVal