function registrarUsuario() {
    const user = document.getElementById("usuario").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (user === "" || pass === "") {
        alert("Debes completar todos los campos");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.find(u => u.usuario === user)) {
        alert("Ese usuario ya existe");
        return;
    }

    const nuevoUsuario = {
        usuario: user,
        password: pass,
        perfil: {
            nombre: user,
            descripcion: ""
        }
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuario registrado correctamente");

    // 🔥 login automático después de registrarse
    localStorage.setItem("usuarioActivo", JSON.stringify(nuevoUsuario));

    window.location.href = "inicio.html";
}