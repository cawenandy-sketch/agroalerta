// -------------------------------
// 🔐 SISTEMA DE USUARIO
// -------------------------------

// Obtener usuario activo
function obtenerUsuario() {
  return JSON.parse(localStorage.getItem("usuarioActivo"));
}

// Saber si está logueado
function estaLogueado() {
  return obtenerUsuario() !== null;
}

// Saber si es invitado
function esInvitado() {
  return !estaLogueado();
}

// Proteger páginas
function protegerRuta() {
  if (esInvitado()) {
    alert("Debes iniciar sesión");
    window.location.href = "login.html";
  }
}

// Cerrar sesión
function logout() {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "inicio.html";
}

// -------------------------------
// 🔄 CONTROL NAVBAR + EVENTOS
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const usuario = obtenerUsuario();

  const loginItem = document.getElementById("loginItem");
  const logoutItem = document.getElementById("logoutItem");
  const btnLogout = document.getElementById("btnLogout");

  // 🔐 Navbar
  if (loginItem && logoutItem) {
    if (usuario) {
      loginItem.style.display = "none";
      logoutItem.style.display = "inline-block";
    } else {
      loginItem.style.display = "inline-block";
      logoutItem.style.display = "none";
    }
  }

  // 🚪 Botón logout (sin onclick en HTML)
  if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

  // -------------------------------
  // 🧭 NAVEGACIÓN DE CARDS
  // -------------------------------

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

});

// -------------------------------
// 📢 FUNCIONES GENERALES
// -------------------------------

function verProtocolo() {
  alert("PROTOCOLO SANITARIO:\n\n1 Revisar animales infectados\n2 Aislar ganado enfermo\n3 Contactar veterinario");
}

function verDetalles() {
  alert("Más información sobre esta alerta estará disponible próximamente.");
}