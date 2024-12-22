const authService = require("../services/authService");

const acceso = async (req, res) => {
  try {
    const { correo, contrasenia } = req.body;
    const usuario_id = await authService.consultarUsuario(correo, contrasenia);

    if (usuario_id) {
      req.session.idUsuario = usuario_id;
      res.json({ mensaje: "Inicio de sesión correcto", redirigir: true });
    } else {
      res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ mensaje: "Ocurrió un error al iniciar sesión" });
  }
};

const registro = async (req, res) => {
  try {
    const { usuario, correo, contrasenia } = req.body;

    const usuarioDuplicado = await authService.consultarUsuarioDuplicado(
      correo
    );

    if (usuarioDuplicado) {
      res.status(400).json({ mensaje: "Correo ya registrado", usuarioDuplicado: true });
      return;
    }

    const usuario_id = await authService.registrarUsuario(usuario, correo, contrasenia);
    req.session.idUsuario = usuario_id;
    res
      .status(200)
      .json({ mensaje: "Usuario registrado correctamente"});
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res
      .status(500)
      .json({ mensaje: "Ocurrió un error al registrar el usuario" });
  }
};

const cerrarSesion = async (req, res) => {
  req.session.idUsuario = null;
  res.status(200).json({ mensaje: "Sesión cerrada correctamente" });
}

module.exports = { acceso, registro, cerrarSesion };
