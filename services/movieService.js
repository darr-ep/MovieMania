const { ejecutarConsulta } = require("../config/database");

async function consultarPeliculaFavoritos(usuario_id, pelicula_id) {
  const query = `SELECT * FROM favoritos WHERE usuario_id = ? AND pelicula_id = ?`;
  const resultado = await ejecutarConsulta(query, [ usuario_id, pelicula_id ]);

  return resultado.length !== 0;
}

async function consultarPeliculaPendientes(usuario_id, pelicula_id) {
  const query = `SELECT * FROM pendientes WHERE usuario_id = ? AND pelicula_id = ?`;
  const resultado = await ejecutarConsulta(query, [ usuario_id, pelicula_id ]);

  return resultado.length !== 0;
}

async function consultarPeliculasFavoritos(usuario_id) {
  const query = `SELECT * FROM favoritos WHERE usuario_id = ?`;
  const resultado = await ejecutarConsulta(query, [ usuario_id ]);

  return resultado;
}

async function consultarPeliculasPendientes(usuario_id) {
  const query = `SELECT * FROM pendientes WHERE usuario_id = ?`;
  const resultado = await ejecutarConsulta(query, [ usuario_id ]);

  return resultado;
}

async function registrarPeliculaFavoritos(usuario_id, pelicula_id) {
  const query = `INSERT INTO favoritos (usuario_id, pelicula_id) VALUES (?, ?)`;
  await ejecutarConsulta(query, [ usuario_id, pelicula_id ]);
}

async function registrarPeliculaPendientes(usuario_id, pelicula_id) {
  const query = `INSERT INTO pendientes (usuario_id, pelicula_id) VALUES (?, ?)`;
  await ejecutarConsulta(query, [ usuario_id, pelicula_id ]);
}

async function eliminarPeliculaFavoritos(usuario_id, pelicula_id) {
  const query = `DELETE FROM favoritos WHERE usuario_id = ? AND pelicula_id = ?`;
  await ejecutarConsulta(query, [usuario_id, pelicula_id]);
}

async function eliminarPeliculaPendientes(usuario_id, pelicula_id) {
  const query = `DELETE FROM pendientes WHERE usuario_id = ? AND pelicula_id = ?`;
  await ejecutarConsulta(query, [usuario_id, pelicula_id]);
}

module.exports = {
  consultarPeliculaFavoritos,
  consultarPeliculaPendientes,
  consultarPeliculasFavoritos,
  consultarPeliculasPendientes,
  registrarPeliculaFavoritos,
  registrarPeliculaPendientes,
  eliminarPeliculaFavoritos,
  eliminarPeliculaPendientes,
};
