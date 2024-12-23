const { ejecutarConsulta } = require("../config/database");
const argon2 = require("argon2");

async function hashearContrasenia(password) {
  return (hash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  }));
}

async function verificarContrasenia(contrasenia, hash) {
  return await argon2.verify(hash, contrasenia);
}

async function registrarUsuario(usuario, correo, contrasenia) {
  const query = `INSERT INTO usuarios (usuario, correo, contrasenia) VALUES (?, ?, ?)`;
  const consulta = await ejecutarConsulta(query, [
    usuario,
    correo,
    await hashearContrasenia(contrasenia),
  ]);

  return consulta.insertId;
}

async function consultarUsuario(correo, contrasenia) {
  const query = `SELECT usuario_id, contrasenia FROM usuarios WHERE correo = ?`;
  const consulta = await ejecutarConsulta(query, [correo]);

  if (consulta.length === 0) {
    return null;
  }

  const { usuario_id, contrasenia: contraseniaConsulta } = consulta[0];

  const esContraseniaCorrecta = await verificarContrasenia(
    contrasenia,
    contraseniaConsulta
  );

  if (esContraseniaCorrecta) {
    return usuario_id;
  }

  return null;
}

async function consultarExistenciaUsuario(usuario_id) {
  const query = `SELECT * FROM usuarios WHERE usuario_id = ?`;

  const consulta = await ejecutarConsulta(query, [usuario_id]);

  if (consulta.length > 0) {
    return consulta[0];
  }

  return null;
}

async function consultarAdministrador(usuario_id) {
  const query = `SELECT * FROM administradores WHERE usuario_id = ?`;

  const consulta = await ejecutarConsulta(query, [usuario_id]);

  return consulta.length > 0 ? true : false;
}

async function consultarUsuarioDuplicado(correo) {
  const query = `SELECT usuario_id FROM usuarios WHERE correo = ?`;
  const consulta = await ejecutarConsulta(query, [correo]);

  return consulta.length > 0;
}

module.exports = {
  registrarUsuario,
  consultarUsuario,
  consultarUsuarioDuplicado,
  consultarExistenciaUsuario,
  consultarAdministrador
};
