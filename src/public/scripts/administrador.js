import { swalError } from "./utils.js";

const abrirUsuarios = async () => {
  const modal = document.getElementById("modal-usuarios");
  const modalContenido = document.getElementById("modal-usuarios__contenido");

  modal.classList.add("mostrar");
  modalContenido.classList.add("modal__contenido--abierto");

  try {
    const res = await fetch("/admin/consultarUsuarios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    const tabla = document.getElementById("tabla-usuarios");
    const tbody = tabla ? tabla.querySelector("tbody") : null;

    if (!tbody) {
      console.error("No se encontró el tbody de la tabla.");
      return;
    }

    tbody.innerHTML = ""; // Limpiar las filas previas

    if (data.length > 0) {
      data.forEach((usuario) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${usuario.usuario_id}</td>
          <td>${usuario.usuario}</td>
          <td>${usuario.correo}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      // En caso de no haber datos, mostrar un mensaje
      const tr = document.createElement("tr");
      tr.innerHTML = "<td colspan='4'>No hay usuarios registrados.</td>";
      tbody.appendChild(tr);
    }
  } catch (error) {
    swalError(
      error.message ||
        "Ha ocurrido un problema inesperado. Por favor, inténtelo de nuevo más tarde."
    );
  }
};

window.abrirUsuarios = abrirUsuarios;