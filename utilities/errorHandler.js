// utilities/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(`Error at: "${req.originalUrl}": `, err.message) // log al servidor
  res.status(500).render("errors/error", {
    title: "Server Error",
    message: "Something went wrong. Please try again later.",
    nav: req.nav || "", 
  })
}

module.exports = errorHandler
