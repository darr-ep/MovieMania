const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/consultarUsuarios", adminController.consultarUsuarios);

module.exports = router;