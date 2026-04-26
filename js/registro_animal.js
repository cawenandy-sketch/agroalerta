protegerRuta();

let usuario = obtenerUsuario(); // 🔐 usuario actual
let animales = [];

/* CARGAR DATOS GUARDADOS */

window.onload = function(){

let datosGuardados = localStorage.getItem("animales_" + usuario.usuario);

if(datosGuardados){
animales = JSON.parse(datosGuardados);
}

mostrarAnimales();

}

/* REGISTRAR ANIMAL */

function registrarAnimal(){

let id = document.getElementById("idAnimal").value.trim();
let raza = document.getElementById("raza").value;
let sexo = document.getElementById("sexo").value;
let edad = Number(document.getElementById("edad").value);
let peso = Number(document.getElementById("peso").value);
let observaciones = document.getElementById("observaciones").value;

let estado = "vivo";

if(id === "" || !edad || !peso){
alert("⚠ Debes completar todos los campos obligatorios");
return;
}

if(edad < 0 || edad > 20){
alert("La edad debe estar entre 0 y 20 años");
return;
}

if(peso < 45 || peso > 1000){
alert("El peso debe estar entre 45 y 1000 kg");
return;
}

let salud = calcularSalud(peso);

if(verificarPesoEdad(edad,peso)){
return;
}

let animal = {

id:id,
raza:raza,
sexo:sexo,
edad:edad,
peso:peso,
salud:salud,
estado:estado,
observaciones:observaciones,
historial:[peso]

};

animales.push(animal);

localStorage.setItem("animales_" + usuario.usuario, JSON.stringify(animales));

mostrarAnimales();

document.getElementById("idAnimal").value="";
document.getElementById("edad").value="";
document.getElementById("peso").value="";
document.getElementById("observaciones").value="";

}

/* MOSTRAR ANIMALES */

function mostrarAnimales(){

let tabla = document.getElementById("tablaAnimales");

tabla.innerHTML = "";

animales.forEach((animal,index)=>{

let claseEstado = animal.estado === "vivo" ? "estado-vivo" : "estado-muerto";

let botones = `
<button onclick="actualizarPeso(${index})">Actualizar peso</button>
<button onclick="verHistorial(${index})">Historial</button>
<button onclick="cambiarEstado(${index})">Marcar fallecido</button>
<button onclick="eliminarAnimal(${index})">Eliminar</button>
`;

tabla.innerHTML += `

<tr>

<td>${animal.id}</td>
<td>${animal.raza}</td>
<td>${animal.sexo}</td>
<td>${animal.edad} años</td>
<td>${animal.peso} kg</td>
<td>${animal.salud}</td>
<td class="${claseEstado}">${animal.estado}</td>
<td>${botones}</td>

</tr>

`;

});

}

/* ELIMINAR ANIMAL */

function eliminarAnimal(index){

animales.splice(index,1);

localStorage.setItem("animales_" + usuario.usuario, JSON.stringify(animales));

mostrarAnimales();

}

/* ACTUALIZAR PESO */

function actualizarPeso(index){

let nuevoPeso = Number(prompt("Nuevo peso (kg):"));

if(nuevoPeso < 45 || nuevoPeso > 1000){
alert("Peso inválido");
return;
}

animales[index].peso = nuevoPeso;
animales[index].historial.push(nuevoPeso);

localStorage.setItem("animales_" + usuario.usuario, JSON.stringify(animales));

mostrarAnimales();

}

/* BUSCAR ANIMAL */

function buscarAnimal(){

let filtro = document.getElementById("buscar").value.toLowerCase();

let filas = document.querySelectorAll("#tablaAnimales tr");

filas.forEach(fila=>{

let texto = fila.innerText.toLowerCase();

fila.style.display = texto.includes(filtro) ? "" : "none";

});

}

/* CALCULAR SALUD */

function calcularSalud(peso){

if(peso >= 45 && peso <= 150){
return "En tratamiento";
}

else if(peso >= 151 && peso <= 350){
return "En observación";
}

else if(peso >= 351 && peso <= 800){
return "Saludable";
}

else{
return "Sobrepeso";
}

}

/* VERIFICAR PESO SEGUN EDAD */

function verificarPesoEdad(edad,peso){

let alerta = false;

if(edad <= 1 && peso > 350){
alerta = true;
}

if(edad >= 2 && edad <= 3 && peso < 250){
alerta = true;
}

if(edad >= 4 && peso < 350){
alerta = true;
}

if(alerta){
alert("⚠ El peso no coincide con el peso esperado para la edad del animal");
return true;
}

return false;

}

/* ACTUALIZAR SALUD AUTOMATICA */

function actualizarSalud(){

let peso = Number(document.getElementById("peso").value);

let campoSalud = document.getElementById("salud");

if(!peso){
campoSalud.value = "";
return;
}

campoSalud.value = calcularSalud(peso);

}

/* CAMBIAR ESTADO */

function cambiarEstado(index){

let confirmar = confirm("¿Marcar este animal como fallecido?");

if(confirmar){

animales[index].estado = "muerto";

localStorage.setItem("animales_" + usuario.usuario, JSON.stringify(animales));

mostrarAnimales();

}

}

/* VER HISTORIAL DE PESO */

function verHistorial(index){

let historial = animales[index].historial;

alert("Historial de peso: " + historial.join(" kg -> ") + " kg");

}

/* CONTROL PROPOSITO SEGUN SEXO */

let campoSexo = document.getElementById("sexo");

if (campoSexo) {
    campoSexo.addEventListener("change", actualizarProposito);
}

function actualizarProposito(){

let sexo = document.getElementById("sexo").value;
let proposito = document.getElementById("proposito");

proposito.innerHTML = "";

if(sexo === "Macho"){

proposito.innerHTML = `
<option>Engorde</option>
<option>Reproducción</option>
`;

}else{

proposito.innerHTML = `
<option>Producción de leche</option>
<option>Engorde</option>
<option>Reproducción</option>
`;

}

}