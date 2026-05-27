// auth.js

// --------------------
// TABS
// --------------------

const tabLogin = document.getElementById("tabLogin");

const tabRegistro = document.getElementById("tabRegistro");

const loginForm = document.getElementById("loginForm");

const registroForm = document.getElementById("registroForm");

tabLogin.addEventListener("click",()=>{

tabLogin.classList.add("active");
tabRegistro.classList.remove("active");

loginForm.classList.add("activeForm");
registroForm.classList.remove("activeForm");

});

tabRegistro.addEventListener("click",()=>{

tabRegistro.classList.add("active");
tabLogin.classList.remove("active");

registroForm.classList.add("activeForm");
loginForm.classList.remove("activeForm");

});

document.getElementById("goRegister")
.addEventListener("click",()=>{

tabRegistro.click();

});

document.getElementById("goLogin")
.addEventListener("click",()=>{

tabLogin.click();

});

// --------------------
// TIPO USUARIO
// --------------------

const tipoCards =
document.querySelectorAll(".tipo-card");

tipoCards.forEach(card=>{

card.addEventListener("click",()=>{

tipoCards.forEach(c=>{

c.classList.remove("activeTipo");

});

card.classList.add("activeTipo");

const tipo =
card.dataset.tipo;

document.getElementById("tipoUsuario").value = tipo;

const adminBox =
document.getElementById("adminCodeBox");

if(tipo === "administrador"){

adminBox.classList.remove("hidden");

}else{

adminBox.classList.add("hidden");

}

});

});

// --------------------
// PASSWORD
// --------------------

function togglePassword(id){

const input =
document.getElementById(id);

input.type =
input.type === "password"
? "text"
: "password";

}

const passwordInput =
document.getElementById("password");

passwordInput.addEventListener("input",()=>{

const value =
passwordInput.value;

const strength =
document.getElementById("passwordStrength");

if(value.length < 8){

strength.innerHTML =
"🔴 Débil";

strength.style.color = "red";

}
else if(
/(?=.*[A-Z])(?=.*[\W_])/.test(value)
){

strength.innerHTML =
"🟢 Segura";

strength.style.color = "green";

}
else{

strength.innerHTML =
"🟠 Media";

strength.style.color = "orange";

}

});

// --------------------
// VALIDAR EMAIL
// --------------------

function validarCorreo(correo){

const regex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

return regex.test(correo);

}

// --------------------
// LOGIN
// --------------------

document.getElementById("btnLogin")
.addEventListener("click",()=>{

const user =
document.getElementById("loginUsuario")
.value
.trim();

const pass =
document.getElementById("loginPassword")
.value
.trim();

if(!user || !pass){

alert("Completa todos los campos");
return;

}

fetch("http://localhost/agroalerta/php/login.php",{

method:"POST",

headers:{
"Content-Type":
"application/x-www-form-urlencoded"
},

body:
`correo=${encodeURIComponent(user)}
&password=${encodeURIComponent(pass)}`

})

.then(res=>res.text())

.then(data=>{

console.log(data);

if(data.trim() === "ok"){

localStorage.setItem(
"usuarioActivo",
JSON.stringify({
correo:user
})
);

alert("Inicio de sesión exitoso");

window.location.href = "inicio.html";

}else{

alert("Correo o contraseña incorrectos");

}

});

});

// --------------------
// REGISTRO
// --------------------

document.getElementById("btnRegistro")
.addEventListener("click",()=>{

const nombre =
document.getElementById("nombre").value.trim();

const apellido =
document.getElementById("apellido").value.trim();

const correo =
document.getElementById("usuario").value.trim();

const cedula =
document.getElementById("cedula").value.trim();

const celular =
document.getElementById("celular").value.trim();

const licose =
document.getElementById("licose").value.trim();

const password =
document.getElementById("password").value.trim();

const confirmPassword =
document.getElementById("confirmPassword").value.trim();

const tipo =
document.getElementById("tipoUsuario").value;

const codigoAdmin =
document.getElementById("codigoAdmin").value.trim();

if(
!nombre ||
!apellido ||
!correo ||
!cedula ||
!celular ||
!licose ||
!password ||
!confirmPassword
){

alert("Completa todos los campos");
return;

}

// --------------------
// VALIDAR EMAIL
// --------------------

if(!validarCorreo(correo)){

alert("Ingresa un correo electrónico válido");

return;

}

if(password !== confirmPassword){

alert("Las contraseñas no coinciden");
return;

}

if(password.length < 8){

alert(
"La contraseña debe tener mínimo 8 caracteres"
);

return;

}

if(
tipo === "administrador" &&
codigoAdmin !== "AGRO2026"
){

alert("Código administrador incorrecto");
return;

}

fetch("http://localhost/agroalerta/php/registro.php",{

method:"POST",

headers:{
"Content-Type":
"application/x-www-form-urlencoded"
},

body:
`correo=${encodeURIComponent(correo)}
&password=${encodeURIComponent(password)}
&cedula=${encodeURIComponent(cedula)}
&celular=${encodeURIComponent(celular)}
&licose=${encodeURIComponent(licose)}
&nombre=${encodeURIComponent(nombre)}
&apellido=${encodeURIComponent(apellido)}
&tipo_usuario=${encodeURIComponent(tipo)}`

})

.then(res=>res.text())

.then(data=>{

console.log(data);

if(data.trim() === "ok"){

alert("Cuenta creada correctamente");

tabLogin.click();

}else if(data.trim() === "existe"){

alert("Ese correo electrónico ya existe");

}else{

alert("Error: " + data);

}

});

});

// --------------------
// INVITADO
// --------------------

document.getElementById("btnInvitado")
.addEventListener("click",()=>{

localStorage.removeItem("usuarioActivo");

window.location.href = "inicio.html";

});