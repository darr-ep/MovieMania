let seccionProximamente = 0;

function avanzarProximamente() {
  seccionProximamente += 4;

  if (seccionProximamente >= proximamente.length) {
    seccionProximamente = proximamente.length - 4;
  }

  renderizarProximamente();
}

function retrocederProximamente() {
  seccionProximamente -= 4;

  if (seccionProximamente < 0) {
    seccionProximamente = 0;
  }

  renderizarProximamente();
}

function renderizarProximamente() {
  const paginas = Math.ceil(proximamente.length / 4);
  const paginaActual = Math.ceil((seccionProximamente + 1) / 4);
  document.getElementById(
    "proximamente__titulo"
  ).textContent = `Proximamente (${paginaActual} de ${paginas})`;

  const siguiente = document.querySelector(
    `.proximamente__peliculas--avanzar.siguiente`
  );
  const anterior = document.querySelector(
    `.proximamente__peliculas--avanzar.anterior`
  );

  if (seccionProximamente === 0) {
    anterior.style.visibility = "hidden";
    anterior.style.opacity = "0";
  } else {
    anterior.style.visibility = "visible";
    anterior.style.opacity = "1";
  }

  if (seccionProximamente + 4 >= proximamente.length) {
    siguiente.style.visibility = "hidden";
    siguiente.style.opacity = "0";
  } else {
    siguiente.style.visibility = "visible";
    siguiente.style.opacity = "1";
  }

  const titulo1 = document.querySelector(`#proximamente__pelicula--titulo-1`);
  const imagen1 = document.querySelector(`#proximamente__pelicula--imagen-1`);
  const fechaEstreno1 = document.querySelector(
    `#proximamente__pelicula--fecha-estreno-1`
  );
  const descripcion1 = document.querySelector(
    `#proximamente__pelicula--descripcion-1`
  );

  const titulo2 = document.querySelector(`#proximamente__pelicula--titulo-2`);
  const imagen2 = document.querySelector(`#proximamente__pelicula--imagen-2`);
  const fechaEstreno2 = document.querySelector(
    `#proximamente__pelicula--fecha-estreno-2`
  );
  const descripcion2 = document.querySelector(
    `#proximamente__pelicula--descripcion-2`
  );

  const titulo3 = document.querySelector(`#proximamente__pelicula--titulo-3`);
  const imagen3 = document.querySelector(`#proximamente__pelicula--imagen-3`);
  const fechaEstreno3 = document.querySelector(
    `#proximamente__pelicula--fecha-estreno-3`
  );
  const descripcion3 = document.querySelector(
    `#proximamente__pelicula--descripcion-3`
  );

  const titulo4 = document.querySelector(`#proximamente__pelicula--titulo-4`);
  const imagen4 = document.querySelector(`#proximamente__pelicula--imagen-4`);
  const fechaEstreno4 = document.querySelector(
    `#proximamente__pelicula--fecha-estreno-4`
  );
  const descripcion4 = document.querySelector(
    `#proximamente__pelicula--descripcion-4`
  );

  titulo1.textContent = proximamente[seccionProximamente].title;
  imagen1.src =
    "https://image.tmdb.org/t/p/w500" +
    proximamente[seccionProximamente].backdrop_path;
  fechaEstreno1.textContent =
    "Estreno: " + proximamente[seccionProximamente].release_date;
  if (proximamente[seccionProximamente].overview) {
    descripcion1.textContent = proximamente[seccionProximamente].overview;
  } else {
    descripcion1.textContent = "Sin descripción";
  }

  titulo2.textContent = proximamente[seccionProximamente + 1].title;
  imagen2.src =
    "https://image.tmdb.org/t/p/w500" +
    proximamente[seccionProximamente + 1].backdrop_path;
  fechaEstreno2.textContent =
    "Estreno: " + proximamente[seccionProximamente + 1].release_date;
  if (proximamente[seccionProximamente + 1].overview) {
    descripcion2.textContent = proximamente[seccionProximamente + 1].overview;
  } else {
    descripcion2.textContent = "Sin descripción";
  }

  titulo3.textContent = proximamente[seccionProximamente + 2].title;
  imagen3.src =
    "https://image.tmdb.org/t/p/w500" +
    proximamente[seccionProximamente + 2].backdrop_path;
  fechaEstreno3.textContent =
    "Estreno: " + proximamente[seccionProximamente + 2].release_date;
  if (proximamente[seccionProximamente + 2].overview) {
    descripcion3.textContent = proximamente[seccionProximamente + 2].overview;
  } else {
    descripcion3.textContent = "Sin descripción";
  }

  titulo4.textContent = proximamente[seccionProximamente + 3].title;
  imagen4.src =
    "https://image.tmdb.org/t/p/w500" +
    proximamente[seccionProximamente + 3].backdrop_path;
  fechaEstreno4.textContent =
    "Estreno: " + proximamente[seccionProximamente + 3].release_date;
  if (proximamente[seccionProximamente + 3].overview) {
    descripcion4.textContent = proximamente[seccionProximamente + 3].overview;
  } else {
    descripcion4.textContent = "Sin descripción";
  }
}

async function abrirModalProximamente(index) {
  document.getElementById("loader").classList.add("mostrar");
  document.getElementById("modal-proximamente__imagen").src = "";

  const idMovie = proximamente[seccionProximamente + index].id;

  try {
    const res = await fetch("/movie/consultarPelicula", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idMovie }),
    });

    if (res.status === 404) {
      swalError("Película no encontrada.");
      return;
    }

    if (res.status === 500) {
      swalError("Error al obtener la información de la película.");
      return;
    }

    const data = await res.json();

    document.getElementById("loader").classList.remove("mostrar");

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
  } catch (error) {
    console.error(error);
    document.getElementById("loader").classList.remove("mostrar");
  }
}
