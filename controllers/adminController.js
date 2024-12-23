const adminService = require("../services/adminService");

const consultarUsuarios = async (req, res) => {
  try {
    const usuarios = await adminService.consultarUsuarios();

    if (usuarios) {
      res.status(200).json(usuarios);
    } else {
      res.status(404).json({ mensaje: "No se encontraron usuarios" });
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ mensaje: "Ocurrió un error al iniciar sesión" });
  }
};

module.exports = { consultarUsuarios };
