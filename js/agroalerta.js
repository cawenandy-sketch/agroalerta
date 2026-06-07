function obtenerUsuario() {
  return JSON.parse(localStorage.getItem("usuarioActivo"));
}

function estaLogueado() {
  return obtenerUsuario() !== null;
}

function esInvitado() {
  return !estaLogueado();
}

function esAdministrador() {
  const usuario = obtenerUsuario();

  if (!usuario) {
    return false;
  }

  return usuario.tipo === "administrador";
}

function protegerRuta() {
  if (esInvitado()) {
    alert("Debes iniciar sesión");
    window.location.href = "auth.html";
  }
}

function logout() {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "inicio.html";
}

document.addEventListener("DOMContentLoaded", () => {

  const usuario = obtenerUsuario();

  const loginItem = document.getElementById("loginItem");
  const logoutItem = document.getElementById("logoutItem");
  const btnLogout = document.getElementById("btnLogout");

  if (loginItem && logoutItem) {

    if (usuario) {

      loginItem.style.display = "none";
      logoutItem.style.display = "inline-block";

    } else {

      loginItem.style.display = "inline-block";
      logoutItem.style.display = "none";

    }

  }

  if (btnLogout) {

    btnLogout.addEventListener("click", (e) => {

      e.preventDefault();
      logout();

    });

  }

  const cardAgroalerta = document.getElementById("cardAgroalerta");
  const cardAreaAnimal = document.getElementById("cardAreaAnimal");
  const cardBiografia = document.getElementById("cardBiografia");

  if (cardAgroalerta) {

    cardAgroalerta.addEventListener("click", () => {

      window.location.href = "agroalerta.html";

    });

  }

  if (cardAreaAnimal) {

    cardAreaAnimal.addEventListener("click", () => {

      window.location.href = "area_animal.html";

    });

  }

  if (cardBiografia) {

    cardBiografia.addEventListener("click", () => {

      window.location.href = "biografia.html";

    });

  }

  // --------------------
  // BOTÓN PANEL ADMIN
  // --------------------

  const btnPanelAdmin = document.getElementById("btnPanelAdmin");

  if (btnPanelAdmin) {

    if (esAdministrador()) {

      btnPanelAdmin.style.display = "inline-block";

      btnPanelAdmin.addEventListener("click", () => {

        window.location.href = "panel_admin.html";

      });

    } else {

      btnPanelAdmin.style.display = "none";

    }

  }

});

function verProtocolo() {

  alert(
    "PROTOCOLO SANITARIO:\n\n1 Revisar animales infectados\n2 Aislar ganado enfermo\n3 Contactar veterinario"
  );

}

function verDetalles() {

  alert(
    "Más información sobre esta alerta estará disponible próximamente."
  );

}