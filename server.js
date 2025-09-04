/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
<<<<<<< HEAD
const expressLayouts = require("express-ejs-layouts")
=======
>>>>>>> e0f2ac4b7bf2c161aadde96399763e5e1b4b7d8f
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")

<<<<<<< HEAD

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

=======
>>>>>>> e0f2ac4b7bf2c161aadde96399763e5e1b4b7d8f
/* ***********************
 * Routes
 *************************/
app.use(static)
<<<<<<< HEAD
//Index route
app.get("/", function(req, res){
  res.render("index", {title: "BYU"})
})
=======
>>>>>>> e0f2ac4b7bf2c161aadde96399763e5e1b4b7d8f

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
