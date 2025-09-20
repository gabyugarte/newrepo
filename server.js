/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

/* ***********************
 * Middleware
 *************************/
app.use(express.static("public"))

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)

/* ***********************
 * 404 Error Handler
 *************************/
app.use(async (req, res, next) => {
  let nav = await utilities.getNav()
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: "Sorry, the page you are looking for does not exist.",
    statusCode: 404,
    nav,
  })
})

/* ***********************
 * 500 Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  console.error("500 Error:", err.message)
  let nav = await utilities.getNav()
  res.status(500).render("errors/error", {
    title: "500 - Internal Server Error",
    message: "Oops! Something went wrong on our end.",
    statusCode: 500,
    nav,
  })
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
