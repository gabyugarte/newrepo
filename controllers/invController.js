
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const inventoryVal = require("../utilities/inventory-validation")

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    console.log(`buildByClassificationId: Loading vehicles for classification ${classification_id}`)
    
    const data = await invModel.getInventoryByClassificationId(classification_id)
    console.log(`buildByClassificationId: Found ${data.length} vehicles`)
    
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    
    // Obtener el nombre de la clasificación
    let className = "Vehicles"
    if (data.length > 0 && data[0].classification_name) {
      className = data[0].classification_name
    } else {
      // Si no hay vehículos, obtener el nombre de otra manera
      const classifications = await invModel.getClassifications()
      const classification = classifications.find(c => c.classification_id == classification_id)
      className = classification ? classification.classification_name : "Unknown"
    }
    
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    console.error("Error in buildByClassificationId:", error)
    next(error)
  }
}

/* ***************************
 *  Build detail view by inv_id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const data = await invModel.getVehicleById(inv_id);

    if (!data) {
      let nav = await utilities.getNav();
      return res.status(404).render("./inventory/detail", {
        title: "Vehicle Not Found",
        nav,
        detail: "<p class='notice'>Sorry, that vehicle could not be found.</p>",
      });
    }

    const detail = await utilities.buildVehicleDetail(data);
    let nav = await utilities.getNav();
    const itemName = `${data.inv_make} ${data.inv_model}`;

    res.render("./inventory/detail", {
      title: itemName,
      nav,
      detail,
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Cause intentional error (for testing)
 * ************************** */
invCont.causeError = async function (req, res, next) {
  try {
    throw new Error("Intentional server error for testing purposes");
  } catch (err) {
    next(err);
  }
}

/* ***************************
 * Build inventory management view - TASK 1
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      flashMessage: req.flash("notice") || null,
      classificationSelect, 
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 * Build add classification view - TASK 2 (SIMPLIFICADO)
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      flashMessage: null,
      classification_name: ""
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 * Add new classification - TASK 2 (SIMPLIFICADO)
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    console.log("addClassification controller called");
    console.log("Request body:", req.body);
    
    const { classification_name } = req.body;
    
    // Validación básica en el controlador
    if (!classification_name || classification_name.trim() === '') {
      req.flash("notice", "Please provide a classification name.");
      return res.redirect("/inv/add-classification");
    }
    
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(classification_name)) {
      req.flash("notice", "Classification name cannot contain spaces or special characters.");
      return res.redirect("/inv/add-classification");
    }
    
    // Insert into database
    const result = await invModel.addClassification(classification_name);
    
    console.log("Database result:", result);
    
    if (typeof result === 'string' && result.includes('error')) {
      req.flash("notice", "Error adding classification. Please try again.");
      return res.redirect("/inv/add-classification");
    }
    
    // Success
    req.flash("notice", `Classification "${classification_name}" added successfully!`);
    res.redirect("/inv");
    
  } catch (error) {
    console.error("Error in addClassification:", error);
    next(error);
  }
}

/* ***************************
 * Build add inventory view - TASK 3 (SIMPLIFICADO)
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList()
    console.log("buildAddInventory - nav:", nav ? "✅ Existe" : "❌ No existe")
    // Intentar construir la lista de clasificaciones
    try {
      if (utilities.buildClassificationList) {
        classificationList = await utilities.buildClassificationList();
      }
    } catch (error) {
      console.log("Error building classification list:", error);
    }
    
    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav: nav,
      classificationList: classificationList,
      errors: null,
      flashMessage: null,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: ""
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 * Add new inventory item - TASK 3 
 * ************************** */


/* ***************************
 * Add new inventory item - CON DEBUG
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    console.log("=== addInventory INICIADO ===")
    console.log("Request body:", req.body)

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

    console.log(`Guardando: ${inv_make} ${inv_model} para classification_id: ${classification_id}`)

    // Insert into database
    const result = await invModel.addInventory({
      inv_make: inv_make.trim(),
      inv_model: inv_model.trim(),
      inv_year: parseInt(inv_year),
      inv_description: inv_description.trim(),
      inv_image: inv_image.trim() || "/images/vehicles/no-image.png",
      inv_thumbnail: inv_thumbnail.trim() || "/images/vehicles/no-image-tn.png",
      inv_price: parseFloat(inv_price),
      inv_miles: parseInt(inv_miles),
      inv_color: inv_color.trim(),
      classification_id: parseInt(classification_id)
    })

    console.log("Resultado de la inserción:", result)

    // Verificar si hubo error
    if (typeof result === 'string' && result.includes('error')) {
      console.log("❌ Error en la inserción")
      req.flash("notice", "Error adding vehicle. Please try again.")
      
      let classificationList = await utilities.buildClassificationList(classification_id)
      return res.render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav: await utilities.getNav(),
        classificationList,
        errors: null,
        flashMessage: req.flash("notice"),
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

  
    if (result && result.inv_id) {
      console.log(`✅ Vehículo insertado con ID: ${result.inv_id}`)
      console.log(`🔀 Redirigiendo a: /inv/detail/${result.inv_id}`)
      
      req.flash("notice", `¡Éxito! Vehículo ${inv_make} ${inv_model} agregado correctamente.`)
      return res.redirect(`/inv/detail/${result.inv_id}`)
    } else {
      console.log("❌ No se pudo obtener el ID del vehículo insertado")
      console.log("Result completo:", result)
      
      // Fallback: redirigir a la gestión
      req.flash("notice", `Vehículo ${inv_make} ${inv_model} agregado, pero hubo un problema al mostrar los detalles.`)
      return res.redirect("/inv")
    }

  } catch (error) {
    console.error("💥 Error en addInventory:", error)
    next(error)
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    const inv_id = parseInt(req.body.inv_id)
    if (invData && invData.length > 0) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    // 1. Obtener el id desde la URL
    const inv_id = parseInt(req.params.inv_id)

    // 2. Construir la barra de navegación
    let nav = await utilities.getNav()

    // 3. Traer la data del vehículo desde el modelo
    // const itemData = await invModel.getInventoryById(inv_id)
    const vehicle = await invModel.getInventoryById(inv_id)

    // 4. Construir la lista de clasificaciones (marcar seleccionada la actual)
    const classificationSelect = await utilities.buildClassificationList(vehicle.classification_id)

    // 5. Nombre amigable del vehículo (Make + Model)
    const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`

    // 6. Renderizar la vista edit-inventory con los datos precargados
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList: classificationSelect,
      errors: null,
      flashMessage: null,
      inv_id: vehicle.inv_id,
      inv_make: vehicle.inv_make,
      inv_model: vehicle.inv_model,
      inv_year: vehicle.inv_year,
      inv_description: vehicle.inv_description,
      inv_image: vehicle.inv_image,
      inv_thumbnail: vehicle.inv_thumbnail,
      inv_price: vehicle.inv_price,
      inv_miles: vehicle.inv_miles,
      inv_color: vehicle.inv_color,
      classification_id: vehicle.classification_id
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
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
}





module.exports = invCont;