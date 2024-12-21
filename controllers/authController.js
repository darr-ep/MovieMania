const authService = require("../services/authService");

const acceso = async (req, res) => {
  try {
    const { correo, contrasenia } = req.body;
    const usuario_id = await authService.consultarUsuario(
      correo,
      contrasenia
    );

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
    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      telefono,
      correo,
      contrasenia,
    } = req.body;

    const usuario_id = await authService.registrarUsuario(
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      telefono,
      correo,
      contrasenia
    );

    await authService.registrarTokenAuth(sharedSecret, usuario_id);

    req.session.idUsuario = usuario_id;
    res.status(200).json({ mensaje: "Usuario registrado correctamente", redirigir: true });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ mensaje: "Ocurrió un error al registrar el usuario" });
  }
};

const registroDuplicado = async (req, res) => {
  try {
    const { correo, contrasenia, repetirContrasenia } = req.body;

    const usuario = await authService.consultarUsuarioDuplicado(correo);

    if (usuario) {
      res.json({ mensaje: "Usuario no disponible", ocupado: true},);
      return
    }

    if (!(contrasenia === repetirContrasenia)) {
      res.json({ mensaje: "Las contraseñas no coinciden", diferentes: true });
      return;
    }

    res.json({ mensaje: "Usuario disponible"});
  } catch (error) {
    console.error("Error al verificar usuario duplicado:", error);
    res
      .status(500)
      .json({ mensaje: "Ocurrió un error al verificar usuario duplicado" });
  }
}

module.exports = { acceso, registro, registroDuplicado };
