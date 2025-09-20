const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build detail view by inv_id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id  // 
  const data = await invModel.getVehicleById(inv_id)

  if (!data) {
    let nav = await utilities.getNav()
    return res.status(404).render("./inventory/detail", {
      title: "Vehicle Not Found",
      nav,
      detail: "<p class='notice'>Sorry, that vehicle could not be found.</p>",
    })
  }

  const detail = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()
  const itemName = `${data.inv_make} ${data.inv_model}`

  res.render("./inventory/detail", {
    title: itemName,
    nav,
    detail,
  })
}

/* ***************************
 *  Cause intentional error (for testing)
 * ************************** */
invCont.causeError = async function (req, res, next) {
  try {
    // Lanzamos un error intencional
    throw new Error("Intentional server error for testing purposes")
  } catch (err) {
    next(err)
  }
}



 module.exports = invCont