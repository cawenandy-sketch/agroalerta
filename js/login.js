// -------------------------------
// 🔐 LOGIN
// -------------------------------

function login() {

    const user = document.getElementById("usuario").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (!user || !pass) {
        alert("Completa todos los campos");
        return;
    }

    fetch("http://localhost/agroalerta/php/login.php", {
        method: "POST",

        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },

        body:
        `usuario=${encodeURIComponent(user)}
        &password=${encodeURIComponent(pass)}`

    })

    .then(res => res.text())

    .then(data => {

        console.log("LOGIN RESPUESTA:", data);

        if (data.trim() === "ok") {

            localStorage.setItem(
                "usuarioActivo",
                JSON.stringify({ usuario: user })
            );

            alert("Bienvenido " + user);

            window.location.href = "inicio.html";

        } else {

            alert("Usuario o contraseña incorrectos");

        }

    });

}


// -------------------------------
// 📝 VALIDACIONES
// -------------------------------

// 🔑 contraseña segura
function validarPassword(pass) {

    // mínimo 8
    // una mayúscula
    // un símbolo

    const regex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    return regex.test(pass);

}


// 🪪 cédula
function validarCedula(cedula) {

    const regex = /^[0-9]{8}$/;

    return regex.test(cedula);

}


// 📱 celular
function validarCelular(celular) {

    const regex = /^[0-9]{9}$/;

    return regex.test(celular);

}


// 🐄 LICOSE
function validarLicose(licose) {

    const regex = /^[a-zA-Z0-9]{12}$/;

    return regex.test(licose);

}


// -------------------------------
// 📝 REGISTRO
// -------------------------------

function registrarUsuario() {

    const user = document.getElementById("usuario").value.trim();

    const pass = document.getElementById("password").value.trim();

    const cedula = document.getElementById("cedula").value.trim();

    const celular = document.getElementById("celular").value.trim();

    const licose = document.getElementById("licose").value.trim();


    // 🔥 campos vacíos

    if (!user || !pass || !cedula || !celular || !licose) {

        alert("Completa todos los campos");

        return;

    }


    // 🔥 validaciones

    if (!validarPassword(pass)) {

        alert(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un símbolo"
        );

        return;

    }


    if (!validarCedula(cedula)) {

        alert("La cédula debe tener exactamente 8 números");

        return;

    }


    if (!validarCelular(celular)) {

        alert("El celular debe tener exactamente 9 números");

        return;

    }


    if (!validarLicose(licose)) {

        alert("El LICOSE debe tener 12 caracteres alfanuméricos");

        return;

    }


    // 🔥 envío al PHP

    fetch("http://localhost/agroalerta/php/registro.php", {

        method: "POST",

        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },

        body:
        `usuario=${encodeURIComponent(user)}
        &password=${encodeURIComponent(pass)}
        &cedula=${encodeURIComponent(cedula)}
        &celular=${encodeURIComponent(celular)}
        &licose=${encodeURIComponent(licose)}`

    })

    .then(res => res.text())

    .then(data => {

        console.log("REGISTRO RESPUESTA:", data);

        if (data.trim() === "ok") {

            alert("Usuario creado correctamente");

            window.location.href = "login.html";

        }

        else if (data.trim() === "existe") {

            alert("Ese usuario ya existe");

        }

        else {

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
// 🔘 EVENTOS
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