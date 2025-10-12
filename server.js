/* ******************************************
 * Main server.js file - controls the app
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const path = require("path")
const cookieParser = require("cookie-parser")
const flash = require("connect-flash")
const session = require("express-session")
const pool = require("./database/")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const staticRoute = require("./routes/static")
const utilities = require("./utilities/")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 *************************/
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ✅ Session setup (using connect-pg-simple)
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
)

// ✅ Flash messages
app.use(flash())

// ✅ Cookie parser
app.use(cookieParser())

// ✅ Custom locals middleware (for EJS access)
app.use((req, res, next) => {
  res.locals.messages = req.flash()
  res.locals.loggedin = req.session.loggedin || false
  res.locals.accountData = req.session.accountData || null
  next()
})

// ✅ JWT middleware (if using tokens)
app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/
app.use(staticRoute)
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

/* ***********************
 * 404 Error Handler
 *************************/
app.use(async (req, res) => {
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
 * Start Server
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(` App listening on http://${host}:${port}`)
})

// Middleware global para pasar la sesión a las vistas
app.use((req, res, next) => {
  // Si hay sesión activa, pasamos los datos del usuario a las vistas
  res.locals.loggedin = req.session.loggedin || false
  res.locals.accountData = req.session.accountData || null
  next()
})
