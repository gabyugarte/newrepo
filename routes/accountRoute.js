// routes/accountRoute.js
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const accountValidate = require("../utilities/account-validation")

// ✅ Mover multer y configuración ARRIBA antes de usarlo
const multer = require("multer")
const path = require("path")

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/profiles")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix)
  },
})

// Filtro de tipos permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb("Error: Images Only!")
  }
}

// Inicializa multer
const upload = multer({ storage, fileFilter })

/* ***************************
 *  GET Login view
 * ************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ***************************
 *  Profile picture upload
 * ************************** */
router.post(
  "/upload-profile",
  utilities.checkLogin,
  upload.single("profileImage"), // ✅ Ya definida correctamente arriba
  accountController.uploadProfileImage
)

/* ***************************
 *  GET Registration view
 * ************************** */
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

/* ***************************
 *  POST Registration process
 * ************************** */
router.post(
  "/register",
  regValidate.registrationRules(),  // reglas de validación
  regValidate.checkRegData,         // chequea errores y stickiness
  utilities.handleErrors(accountController.registerAccount) // controlador
)

// Default route for account management
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// Deliver edit account view
router.get(
  "/edit",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildEditAccount)
)

// Logout route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Logout Error:", err)
    }
    res.clearCookie("session-id")
    res.redirect("/")
  })
})

router.get(
  "/edit/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
)

// Procesa la actualización de datos (nombre, email, etc.)
router.post(
  "/update",
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Procesa el cambio de contraseña
router.post(
  "/update-password",
  accountValidate.passwordChangeRules(),
  accountValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)



module.exports = router
