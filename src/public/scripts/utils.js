export function swalError(mensaje) {
  Swal.fire({
    title: "Oh no!",
    text: mensaje,
    icon: "error",
    showConfirmButton: false,
    timer: 2000,
  });
}

export function swalExito(mensaje) {
  Swal.fire({
    title: "¡Hecho!",
    text: mensaje,
    icon: "success",
    showConfirmButton: false,
    timer: 2000,
  });
}

export const activarCargando = () => {
  document.getElementById("loader").classList.add("mostrar");
};

export const desactivarCargando = () => {
  document.getElementById("loader").classList.remove("mostrar");
};
