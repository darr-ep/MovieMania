import { activarCargando, desactivarCargando, swalError } from "./utils.js";

const abrirIniciarSesion = () => {
  const modal = document.getElementById("modal-inicio-sesion");
  const modalContenido = document.getElementById(
    "modal-inicio-sesion__contenido"
  );

  modal.classList.add("mostrar");
  modalContenido.classList.add("modal__contenido--abierto");
};

const abrirRegistro = async () => {
  const modal = document.getElementById("modal-registro");
  const modalContenido = document.getElementById("modal-registro__contenido");

  modal.classList.add("mostrar");
  modalContenido.classList.add("modal__contenido--abierto");
};

const acceder = async () => {
  const formulario = document.getElementById("iniciar-sesion");

  if (validarFormulario(formulario, "Completa los campos para continuar")) {
    activarCargando();

    try {
      const formDataAcceso = new FormData(formulario);
      let formObject = {};

      formDataAcceso.forEach((value, key) => {
        formObject[key] = value;
      });

      const res = await fetch("/auth/acceso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const data = await res.json();

      if (!data.redirigir) {
        swalError("El correo y/o la contraseña es incorrecta.");
        return;
      }

      window.location.reload();
    } catch (error) {
      swalError(
        error.message ||
          "Ha ocurrido un problema inesperado. Por favor, inténtelo de nuevo más tarde."
      );
    } finally {
      desactivarCargando();
    }
  }
};

const registrarse = async () => {
  const formRegistro = document.getElementById("registrar");

  if (validarFormulario(formRegistro, "Completa los campos para continuar.")) {
    activarCargando();

    try {
      let formObject = {};

      const formDataAuthAcceso = new FormData(formRegistro);
      formDataAuthAcceso.forEach((value, key) => {
        formObject[key] = value;
      });

      const res = await fetch("/auth/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const data = await res.json();

      if (data.usuarioDuplicado) {
        swalError("El correo electrónico ya está registrado.");
        return;
      }

      window.location.reload();
    } catch (error) {
      swalError(
        error.message ||
          "Ha ocurrido un problema inesperado. Por favor, inténtelo de nuevo más tarde."
      );
    } finally {
      desactivarCargando();
    }
  }
};

const validarFormulario = (formulario, mensajeError) => {
  if (!formulario.checkValidity()) {
    swalError(mensajeError);
    return false;
  }
  return true;
};

const cerrarSesion = async () => {
  try {
    const res = await fetch("/auth/cerrar-sesion", {
      method: "POST",
    });

    if (res.status === 200) {
      window.location.reload();
    }
  } catch (error) {
    swalError(
      error.message ||
        "Ha ocurrido un problema inesperado. Por favor, inténtelo de nuevo más tarde."
    );
  }
};

window.abrirIniciarSesion = abrirIniciarSesion;
window.abrirRegistro = abrirRegistro;
window.acceder = acceder;
window.registrarse = registrarse;
window.cerrarSesion = cerrarSesion;