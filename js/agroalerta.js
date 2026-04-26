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

// Proteger páginas (bloquear invitados)
function protegerRuta() {
  if (!estaLogueado()) {
    alert("Debes iniciar sesión");
    window.location.href = "login.html";
  }
}

// Cerrar sesión (ARREGLADO)
function logout() {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "inicio.html"; // 🔥 antes decía index.html
}

// -------------------------------
// 📢 FUNCIONES ORIGINALES
// -------------------------------

function verProtocolo() {
  alert("PROTOCOLO SANITARIO:\n\n1 Revisar animales infectados\n2 Aislar ganado enfermo\n3 Contactar veterinario");
}

function verDetalles() {
  alert("Más información sobre esta alerta estará disponible próximamente.");
}