let seccionPopulares = 0;

function avanzarPopulares() {
  seccionPopulares += 3;

  if (seccionPopulares >= populares.length) {
    seccionPopulares = populares.length - 3;
  }

  renderizarPopulares();
}

function retrocederPopulares() {
  seccionPopulares -= 3;

  if (seccionPopulares < 0) {
    seccionPopulares = 0;
  }

  renderizarPopulares();
}

function renderizarPopulares() {
  const paginas = Math.ceil(populares.length / 3);
  const paginaActual = Math.ceil((seccionPopulares + 1) / 3);
  document.getElementById(
    "populares__titulo"
  ).textContent = `Populares (${paginaActual} de ${paginas})`;

  const siguiente = document.querySelector(
    `.populares__peliculas--avanzar.siguiente`
  );
  const anterior = document.querySelector(
    `.populares__peliculas--avanzar.anterior`
  );

  if (seccionPopulares === 0) {
    anterior.style.visibility = "hidden";
    anterior.style.opacity = "0";
  } else {
    anterior.style.visibility = "visible";
    anterior.style.opacity = "1";
  }

  if (seccionPopulares + 3 >= populares.length) {
    siguiente.style.visibility = "hidden";
    siguiente.style.opacity = "0";
  } else {
    siguiente.style.visibility = "visible";
    siguiente.style.opacity = "1";
  }

  const titulo1 = document.querySelector(`#populares__pelicula--titulo-1`);
  const imagen1 = document.querySelector(`#populares__pelicula--imagen-1`);

  const titulo2 = document.querySelector(`#populares__pelicula--titulo-2`);
  const imagen2 = document.querySelector(`#populares__pelicula--imagen-2`);

  const titulo3 = document.querySelector(`#populares__pelicula--titulo-3`);
  const imagen3 = document.querySelector(`#populares__pelicula--imagen-3`);

  titulo1.textContent = populares[seccionPopulares].title;
  imagen1.src =
    "https://image.tmdb.org/t/p/w500" + populares[seccionPopulares].backdrop_path;

  titulo2.textContent = populares[seccionPopulares + 1].title;
  imagen2.src =
    "https://image.tmdb.org/t/p/w500" + populares[seccionPopulares + 1].backdrop_path;

  titulo3.textContent = populares[seccionPopulares + 2].title;
  imagen3.src =
    "https://image.tmdb.org/t/p/w500" + populares[seccionPopulares + 2].backdrop_path;
}

async function abrirModalPopulares(index) {
  document.getElementById("loader").classList.add("mostrar");
  document.getElementById("modal-proximamente__imagen").src = "";

  const idMovie = populares[seccionPopulares + index].id;

  const url = `https://api.themoviedb.org/3/movie/${idMovie}?language=es-MX`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNzIyZGU5NWUwZjFmODg2MzNiZDA1ZTZkYjI3YTgwYyIsIm5iZiI6MTczNDcyNDUwNi4wMTcsInN1YiI6IjY3NjVjYjlhMGIyZmJiOWRlYTVlMDRiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-nMkal8lVWqaJwEOJpAVp8vQidcdUzAJZ-hXFCbvnrw",
    },
  };

  let data;

  try {
    const response = await fetch(url, options);
    data = await response.json();

    document.getElementById("loader").classList.remove("mostrar");
  } catch (error) {
    console.error(error);
    document.getElementById("loader").classList.remove("mostrar");
  }

  let generos;
  for (const gender of data.genres) {
    if (generos !== undefined) {
      generos = generos + gender.name + ", ";
    } else {
      generos = gender.name + ", ";
    }
  }
  generos = generos.slice(0, -2);

  let duracion = data.runtime;
  let horas = Math.floor(duracion / 60);
  let minutos = duracion % 60;

  let duracionFormateada = minutos
    ? `${horas}h ${minutos}m`
    : "Duración no disponible";

  const botonFavorito = document.getElementById(
    "modal-proximamente__botones--favorito"
  );
  const botonPendiente = document.getElementById(
    "modal-proximamente__botones--pendiente"
  );
  const botonEliminarFavorito = document.getElementById(
    "modal-proximamente__botones--eliminar-favoritos"
  );
  const botonEliminarPendiente = document.getElementById(
    "modal-proximamente__botones--eliminar-pendientes"
  );

  document.getElementById("modal-proximamente__titulo").textContent =
    data.title;
  document.getElementById("modal-proximamente__imagen").src =
    "https://image.tmdb.org/t/p/w200" + data.poster_path;
  document.getElementById("modal-proximamente__descripcion").textContent =
    data.overview ? data.overview : "Descripción no disponible";
  document.getElementById("modal-proximamente__fecha-genero").textContent =
    data.release_date + " • " + generos;
  document.getElementById("modal-proximamente__duracion").textContent =
    duracionFormateada;

  botonFavorito.setAttribute("data-movie-id", data.id);
  botonPendiente.setAttribute("data-movie-id", data.id);
  botonEliminarFavorito.setAttribute("data-movie-id", data.id);
  botonEliminarPendiente.setAttribute("data-movie-id", data.id);

  const modal = document.getElementById("modal-proximamente");
  const modalContenido = document.getElementById(
    "modal-proximamente__contenido"
  );

  modal.classList.add("mostrar");
  modalContenido.classList.add("modal__contenido--abierto");

  let favoritoEncontrado = false;
  let pendienteEncontrado = false;

  for (const favorito of favoritos) {
    if (data.id == favorito.pelicula_id) {
      favoritoEncontrado = true;
      break;
    }
  }

  for (const pendiente of pendientes) {
    if (data.id == pendiente.pelicula_id) {
      pendienteEncontrado = true;
      break;
    }
  }

  if (favoritoEncontrado) {
    botonFavorito.style.display = "none";
    botonEliminarFavorito.style.display = "block";
  } else {
    botonFavorito.style.display = "block";
    botonEliminarFavorito.style.display = "none";
  }

  if (pendienteEncontrado) {
    botonPendiente.style.display = "none";
    botonEliminarPendiente.style.display = "block";
  } else {
    botonPendiente.style.display = "block";
    botonEliminarPendiente.style.display = "none";
  }
}
