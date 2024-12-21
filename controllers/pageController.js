const inicio = async (req, res) => {
  const urlPopular = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
  const urlUpcoming = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        process.env.TOKEN_API_TMBD,
    },
    
  };

  try {
    const responsePopular = await fetch(urlPopular, options);
    const dataPopular = await responsePopular.json();
    const responseUpcoming = await fetch(urlUpcoming, options);
    const dataUpcoming = await responseUpcoming.json();

    // Renderizar la vista enviando todo el JSON
    res.render("inicio", {
      title: "Inicio",
      popular: dataPopular.results, // Pasar solo los resultados
      proximamente: dataUpcoming.results, // Pasar solo los resultados
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los datos de la API");
  }
};

module.exports = { inicio };
