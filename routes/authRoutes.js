const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/acceso", authController.acceso);
router.post("/registro", authController.registro);
router.post("/cerrar-sesion", authController.cerrarSesion);

module.exports = router;