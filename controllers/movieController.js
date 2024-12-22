const movieService = require("../services/movieService");

const agregarFavoritos = async (req, res) => {
  const { id } = req.body;

  try {
    const resultado = await movieService.consultarPeliculaFavoritos(
      req.session.idUsuario,
      id
    );

    if (resultado) {
      return res.status(400).send("La película ya está en favoritos");
    }

    await movieService.registrarPeliculaFavoritos(req.session.idUsuario, id);

    res.status(200).send("Pelicula agregada a favoritos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar la película a favoritos");
  }
};

const agregarPendientes = async (req, res) => {
  const { id } = req.body;

  try {
    const resultado = await movieService.consultarPeliculaPendientes(
      req.session.idUsuario,
      id
    );

    if (resultado) {
      return res.status(400).send("La película ya está en favoritos");
    }

    await movieService.registrarPeliculaPendientes(req.session.idUsuario, id);

    res.status(200).send("Pelicula agregada a pendientes");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar la película a pendientes");
  }
};

const eliminarFavoritos = async (req, res) => {
  const { id } = req.body;

  try {
    await movieService.eliminarPeliculaFavoritos(req.session.idUsuario, id);

    res.status(200).send("Pelicula eliminada de favoritos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar la película de favoritos");
  }
};

const eliminarPendientes = async (req, res) => {
  const { id } = req.body;

  try {
    await movieService.eliminarPeliculaPendientes(req.session.idUsuario, id);

    res.status(200).send("Pelicula eliminada de pendientes");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar la película de pendientes");
  }
};

const consultarPelicula = async (req, res) => {
  const { idMovie } = req.body;

  try {
    const url = `https://api.themoviedb.org/3/movie/${idMovie}?language=es-MX`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TOKEN_API_TMBD}`,
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Error al obtener los datos de la película" });
    }

    const data = await response.json();

    if (!data.title) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener la información de la película" });
  }
};

module.exports = {
  agregarFavoritos,
  agregarPendientes,
  eliminarFavoritos,
  eliminarPendientes,
  consultarPelicula,
};
