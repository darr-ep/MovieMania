const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.post("/agregarFavoritos", movieController.agregarFavoritos);
router.post("/agregarPendientes", movieController.agregarPendientes);
router.post("/eliminarFavoritos", movieController.eliminarFavoritos);
router.post("/eliminarPendientes", movieController.eliminarPendientes);
router.post("/consultarPelicula", movieController.consultarPelicula);

module.exports = router;
