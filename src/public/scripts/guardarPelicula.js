import { swalError, swalExito } from "./utils.js";

const marcarFavoritos = async (boton) => {
    const id = boton.getAttribute("data-movie-id");
    try {
        const res = await fetch("/movie/agregarFavoritos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
        });
    
        if (res.status === 400) {
            swalError("La película ya está en favoritos.");
            return;
        }

        if (res.status === 200) {
            swalExito("Película agregada a favoritos con éxito.");
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

const marcarPendientes = async (boton) => {
    const id = boton.getAttribute("data-movie-id");
    try {
        const res = await fetch("/movie/agregarPendientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
        });
    
        if (res.status === 400) {
            swalError("La película ya está en pendientes.");
            return;
        }

        if (res.status === 200) {
            swalExito("Película agregada a pendientes con éxito.");
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
}

window.marcarFavoritos = marcarFavoritos;
window.marcarPendientes = marcarPendientes;