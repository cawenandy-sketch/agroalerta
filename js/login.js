// Ir a login
function irLogin() {
    window.location.href = "login.html";
}

// Ir al inicio
function irAlInicio() {
    window.location.href = "inicio.html";
}

// 🔐 LOGIN REAL
function login() {
    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("password").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const encontrado = usuarios.find(u => u.usuario === user && u.password === pass);

    if (encontrado) {
        localStorage.setItem("usuarioActivo", JSON.stringify(encontrado));
        alert("Bienvenido " + encontrado.usuario);
        window.location.href = "inicio.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }
}

// 👤 ENTRAR COMO INVITADO (NUEVO)
function entrarComoInvitado() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "inicio.html";
}