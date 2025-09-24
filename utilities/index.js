const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications()

    let list = '<ul class="main-nav">'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
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
    list += "</ul>"
    return list
  } catch (err) {
    console.error("ERROR in getNav:", err)
    return '<ul><li><a href="/">Home</a></li></ul>'
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


module.exports = {
  ...Util,
  handleErrors
}
