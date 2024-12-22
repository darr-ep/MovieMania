import { swalError, swalExito } from "./utils.js";

let data = [];
let currentPage = 1;
const resultsPerPage = 3

document.addEventListener("DOMContentLoaded", async function () {
  async function fetchMovies() {
    data = [];
    for (const pendiente of pendientes) {
      const url = `https://api.themoviedb.org/3/movie/${pendiente.pelicula_id}?language=es-MX`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNzIyZGU5NWUwZjFmODg2MzNiZDA1ZTZkYjI3YTgwYyIsIm5iZiI6MTczNDcyNDUwNi4wMTcsInN1YiI6IjY3NjVjYjlhMGIyZmJiOWRlYTVlMDRiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-nMkal8lVWqaJwEOJpAVp8vQidcdUzAJZ-hXFCbvnrw",
        },
      };

      try {
        const response = await fetch(url, options);
        const movieData = await response.json();
        data.push(movieData);
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Cargar las películas iniciales
  await fetchMovies();
  renderMovies();
});

function renderMovies() {
  if (data.length === 0) {
    const pendientesContenido = document.getElementById("pendientes__tarjeta");
    pendientesContenido.innerHTML = "No tienes películas pendientes.";
    return;
  }

  const paginas = Math.ceil(data.length / resultsPerPage);

  if (paginas > 1) {
    document.getElementById(
      "pendientes__titulo"
    ).textContent = `Pendientes (${currentPage} de ${paginas})`;
  }

  const container = document.getElementById("pendientes__tarjeta--peliculas");
  container.innerHTML = "";

  const start = (currentPage - 1) * resultsPerPage;
  const end = start + resultsPerPage;
  const moviesToDisplay = data.slice(start, end);

  moviesToDisplay.forEach((movie, index) => {
    const movieHTML = `
          <div class="guardadas__tarjeta">
            <img id="tarjeta__pendientes--imagen-${
              index + 1
            }" class="guardadas__tarjeta--imagen" src="https://image.tmdb.org/t/p/w500${
      movie.backdrop_path || "images/Prueba.png"
    }" alt="${movie.title}">
            <div class="guardadas__tarjeta--detalles">
              <span id="tarjeta__pendientes--titulo-${
                index + 1
              }" class="guardadas__tarjeta--titulo">${movie.title}</span>
              <span id="tarjeta__pendientes--calificacion-${
                index + 1
              }" class="guardadas__tarjeta--calificacion">${
      Math.round(movie.vote_average * 10) / 10
    }/10</span>
            </div>
            <p id="tarjeta__pendientes--descripcion-${
              index + 1
            }" class="guardadas__tarjeta--descripcion">
              ${movie.overview || "Descripción no disponible."}
            </p>
            <button class="boton__1 guardadas__tarjeta--boton" type="button"" onclick="abrirModalPendientes(${
              movie.id
            })">Detalles</button>
          </div>
        `;
    container.innerHTML += movieHTML;
  });

  const siguiente = document.querySelector(
    `.pendientes__peliculas--avanzar.siguiente`
  );
  const anterior = document.querySelector(
    `.pendientes__peliculas--avanzar.anterior`
  );

  if (currentPage * resultsPerPage >= data.length) {
    siguiente.style.visibility = "hidden";
    siguiente.style.opacity = "0";
  } else {
    siguiente.style.visibility = "visible";
    siguiente.style.opacity = "1";
  }

  if (currentPage === 1) {
    anterior.style.visibility = "hidden";
    anterior.style.opacity = "0";
  } else {
    anterior.style.visibility = "visible";
    anterior.style.opacity = "1";
  }
}

const avanzarPendientes = () => {
  if (currentPage * resultsPerPage < data.length) {
    currentPage++;
    renderMovies();
  }
};

const retrocederPendientes = () => {
  if (currentPage > 1) {
    currentPage--;
    renderMovies();
  }
};

async function abrirModalPendientes(idMovie) {
  document.getElementById("loader").classList.add("mostrar");
  document.getElementById("modal-proximamente__imagen").src = "";

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

const eliminarPendientes = async (boton) => {
  const id = boton.getAttribute("data-movie-id");
  try {
    const res = await fetch("/movie/eliminarPendientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.status === 400) {
      swalError("La película no ha sido encontrada.");
      return;
    }

    if (res.status === 200) {
      swalExito("Película eliminada de pendientes con éxito.");
      setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (error) {
    swalError(
      error.message ||
        "Ha ocurrido un problema inesperado. Por favor, inténtelo de nuevo más tarde."
    );
  }
};

window.avanzarPendientes = avanzarPendientes;
window.retrocederPendientes = retrocederPendientes;
window.abrirModalPendientes = abrirModalPendientes;
window.eliminarPendientes = eliminarPendientes;
