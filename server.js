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
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute")
const flash = require("connect-flash")





/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")


/* ***********************
 * Middleware
 *************************/
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Flash messages middleware (EJS compatible)
app.use(function (req, res, next) {
  res.locals.messages = req.flash()
  next()
})


/* ***********************
 * Routes
 *************************/
app.use(static)
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

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
