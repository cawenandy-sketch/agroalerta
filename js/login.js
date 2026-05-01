// -------------------------------
// 🔐 LOGIN
// -------------------------------

function login() {
    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("password").value;

    if (!user || !pass) {
        alert("Completa todos los campos");
        return;
    }

    fetch("http://localhost/agroalerta/php/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `usuario=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`
    })
    .then(res => res.text())
    .then(data => {
        console.log("LOGIN RESPUESTA:", data);

        if (data.trim() === "ok") {
            localStorage.setItem("usuarioActivo", JSON.stringify({ usuario: user }));
            alert("Bienvenido " + user);
            window.location.href = "inicio.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
}


// -------------------------------
// 📝 REGISTRO
// -------------------------------

function registrarUsuario() {
    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("password").value;

    if (!user || !pass) {
        alert("Completa todos los campos");
        return;
    }

    fetch("http://localhost/agroalerta/php/registro.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `usuario=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`
    })
    .then(res => res.text())
    .then(data => {
        console.log("REGISTRO RESPUESTA:", data);

        if (data.trim() === "ok") {
            alert("Usuario creado correctamente");
            window.location.href = "login.html";
        } else if (data.trim() === "existe") {
            alert("Ese usuario ya existe");
        } else {
            alert("Error real: " + data);
        }
    });
}


// -------------------------------
// 👤 INVITADO
// -------------------------------

function entrarComoInvitado() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "inicio.html";
}


// -------------------------------
// 🔘 EVENTOS (SIN onclick en HTML)
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {

    const btnLogin = document.getElementById("btnLogin");
    const btnInvitado = document.getElementById("btnInvitado");
    const btnRegistro = document.getElementById("btnRegistro");

    if (btnLogin) {
        btnLogin.addEventListener("click", login);
    }

    if (btnInvitado) {
        btnInvitado.addEventListener("click", entrarComoInvitado);
    }

    if (btnRegistro) {
        btnRegistro.addEventListener("click", registrarUsuario);
    }

});