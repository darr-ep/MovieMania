function cerrarModal(idFondoModal, idModal) {
    document.getElementById(idFondoModal).classList.remove('mostrar');
    document.getElementById(idModal).classList.remove('modal__contenido--abierto');
}