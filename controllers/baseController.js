const utilities = require("../utilities/");
console.log('DEBUG -> utilities export:', utilities);
console.log('DEBUG -> typeof utilities.getNav:', typeof (utilities && utilities.getNav));

const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

module.exports = baseController