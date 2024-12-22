const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  connectionLimit: 15,
  connectTimeout: 10000,
  waitForConnections: true,
  queueLimit: 0,
});

function manejarErrorConexion(err, reject, reintentar) {
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.error("La conexión con la base de datos se cerró.");
  } else if (err.code === "ER_CON_COUNT_ERROR") {
    console.error("La base de datos tiene demasiadas conexiones.");
  } else if (err.code === "ECONNREFUSED") {
    console.error("La conexión a la base de datos fue rechazada.");
  } else if (
    err.code === "ECONNRESET" ||
    err.code === "ETIMEDOUT" ||
    err.code === "ENOTFOUND"
  ) {
    console.error(`Error de conexión (${err.code}). Reintentando...`);
    setTimeout(reintentar, 2000);
    return;
  }
  reject(err);
}

function obtenerConexion() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        manejarErrorConexion(err, reject, () =>
          obtenerConexion().then(resolve).catch(reject)
        );
      } else {
        resolve(connection);
      }
    });
  });
}

async function ejecutarConsulta(query, params) {
  try {
    let connection = await obtenerConexion();
    return new Promise((resolve, reject) => {
      const intentarConsulta = () => {
        connection.query(query, params, (err, results) => {
          if (err) {
            manejarErrorConexion(err, reject, async () => {
              connection = await obtenerConexion();
              intentarConsulta();
            });
          } else {
            connection.release();
            resolve(results);
          }
        });
      };
      intentarConsulta();
    });
  } catch (err) {
    console.error("Error al obtener conexión:", err);
    throw err;
  }
}

module.exports = {
  ejecutarConsulta,
};
