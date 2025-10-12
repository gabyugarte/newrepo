const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}


/* ************************
 * Constructs the nav HTML unordered list 
 ************************** */
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications()
    console.log("getNav - datos recibidos:", data) // Debug

    let list = '<nav><ul class="main-nav">'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    
  
    if (data && Array.isArray(data)) {
      data.forEach((row) => {
        list += "<li>"
        list +=
          '<a href="/inv/type/' +
          row.classification_id +
          '" title="See our inventory of ' +
          row.classification_name +
          ' vehicles">' +
          row.classification_name +
          "</a>"
        list += "</li>"
      })
    } else {
      console.log("getNav - datos no son array:", data)
    }
    
    list += "</ul></nav>"
    return list
    
  } catch (err) {
    console.error("ERROR in getNav:", err)
    return '<nav><ul class="main-nav"><li><a href="/">Home</a></li></ul></nav>'
  }
}

/* ***************************
 * Build classification select list - AÑADE ESTA FUNCIÓN
 * ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  try {
    const data = await invModel.getClassifications()
    console.log("buildClassificationList - datos recibidos:", data)
    
    let classificationList = '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    
    if (data && Array.isArray(data)) {
      data.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (classification_id != null && row.classification_id == classification_id) {
          classificationList += " selected"
        }
        classificationList += ">" + row.classification_name + "</option>"
      })
    } else {
      console.log("buildClassificationList - datos no son array:", data)
      // Fallback si no hay datos
      classificationList += "<option value=''>No classifications available</option>"
    }
    
    classificationList += "</select>"
    return classificationList
    
  } catch (error) {
    console.error("Error building classification list:", error)
    // Fallback en caso de error
    return '<select name="classification_id" id="classificationList" required><option value="">Error loading classifications</option></select>'
  }
}


/* **************************************
* Build the classification view HTML
* ************************************ */

Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

 
/* ***************************
 * Build vehicle detail HTML
 * ************************** */
Util.buildVehicleDetail = async function(vehicle) {
  if (!vehicle) {
    return '<p class="notice">Sorry, that vehicle could not be found.</p>'
  }

  let detail = '<section id="vehicle-detail">'
  detail += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">`
  detail += '<div class="vehicle-info">'
  detail += `<h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>`
  detail += `<p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
  detail += `<p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>`
  detail += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`
  detail += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`
  detail += '</div>'
  detail += '</section>'

  return detail
}

/* ****************************************
*  Middleware for handling async errors
* *************************************** */
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/* ****************************************
*  Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies && req.cookies.jwt
  if (!token) {
    // No token: dejar los valores por defecto (no logueado)
    res.locals.loggedin = false
    res.locals.accountData = null
    return next()
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
    if (err) {
      // Token inválido o expirado: limpiar cookie y no redirigir aquí
      console.log("JWT verify failed:", err.message || err)
      res.clearCookie("jwt")
      res.locals.loggedin = false
      res.locals.accountData = null
      return next()
    }
    // Token OK -> guardar datos de cuenta en res.locals
    res.locals.accountData = accountData
    res.locals.loggedin = true
    next()
  })
}


/* ****************************************
 *  Check Login (Authorization Middleware)
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  // Si el usuario está en sesión, guardamos sus datos en res.locals
  if (req.session && req.session.accountData) {
    res.locals.loggedin = true
    res.locals.accountData = req.session.accountData
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}



module.exports = {
  ...Util,
  handleErrors
}
