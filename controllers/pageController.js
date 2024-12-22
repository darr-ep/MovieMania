const authService = require("../services/authService");
const movieSevice = require("../services/movieService");

const inicio = async (req, res) => {
  let usuario = null;
  let favoritos = [];
  let pendientes = [];
  
  if (req.session.idUsuario) {
    try {
      const resultado = await authService.consultarExistenciaUsuario(req.session.idUsuario);
      favoritos = await movieSevice.consultarPeliculasFavoritos(req.session.idUsuario);
      pendientes = await movieSevice.consultarPeliculasPendientes(req.session.idUsuario);

      if (resultado) {
        usuario = resultado.usuario;
      }
    } catch (error) {
      console.error("Error al consultar usuario:", error);
    }
  } else {
    req.session.idUsuario = null;
  }

  const urlPopular = 'https://api.themoviedb.org/3/movie/popular?language=es-MX&page=1';
  const urlUpcoming = 'https://api.themoviedb.org/3/movie/upcoming?language=es-MX&page=1';
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:`Bearer ${process.env.TOKEN_API_TMBD}`,
    },
  };

  try {
    const [responsePopular, responseUpcoming] = await Promise.all([
      fetch(urlPopular, options),
      fetch(urlUpcoming, options)
    ]);

    const dataPopular = await responsePopular.json();
    const dataUpcoming = await responseUpcoming.json();

    res.render("inicio", {
      title: "Inicio",
      sesion: req.session.idUsuario,
      usuario: usuario,
      favoritos: favoritos,
      pendientes: pendientes,
      populares: dataPopular.results, // Pasar solo los resultados
      proximamente: dataUpcoming.results, // Pasar solo los resultados
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los datos de la API");
  }
};

module.exports = { inicio };
