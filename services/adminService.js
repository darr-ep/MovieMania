const { ejecutarConsulta } = require("../config/database");

async function consultarUsuarios() {
  const query = `SELECT * FROM usuarios`;
  return await ejecutarConsulta(query, []);
}

module.exports = {
  consultarUsuarios,
};
