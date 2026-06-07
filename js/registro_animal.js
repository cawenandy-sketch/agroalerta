protegerRuta();

document.addEventListener("DOMContentLoaded", () => {

    const btnRegistrar = document.getElementById("btnRegistrarAnimal");

    const inputBuscar = document.getElementById("buscar");

    const inputPeso = document.getElementById("peso");

    const campoSexo = document.getElementById("sexo");

    if (btnRegistrar) {
        btnRegistrar.addEventListener("click", registrarAnimal);
    }

    if (inputBuscar) {
        inputBuscar.addEventListener("keyup", buscarAnimal);
    }

    if (inputPeso) {
        inputPeso.addEventListener("input", actualizarSalud);
    }

    if (campoSexo) {
        campoSexo.addEventListener("change", actualizarProposito);
    }

    cargarAnimales();

});






function registrarAnimal(){

let id = document.getElementById("idAnimal").value.trim();

let raza = document.getElementById("raza").value;

let sexo = document.getElementById("sexo").value;

let edad = Number(document.getElementById("edad").value);

let peso = Number(document.getElementById("peso").value);

let proposito = document.getElementById("proposito").value;

let observaciones = document.getElementById("observaciones").value;

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

fetch("http://localhost/agroalerta/php/registro_animal.php", {

method: "POST",

headers: {
"Content-Type": "application/x-www-form-urlencoded"
},

body:
`id_animal=${encodeURIComponent(id)}
&raza=${encodeURIComponent(raza)}
&sexo=${encodeURIComponent(sexo)}
&proposito=${encodeURIComponent(proposito)}
&edad=${encodeURIComponent(edad)}
&peso=${encodeURIComponent(peso)}
&observaciones=${encodeURIComponent(observaciones)}`

})

.then(res => res.text())

.then(data => {

console.log("RESPUESTA PHP:", data);

if(data.trim() === "ok"){

alert("Animal registrado correctamente");

cargarAnimales();

document.getElementById("idAnimal").value = "";

document.getElementById("edad").value = "";

document.getElementById("peso").value = "";

document.getElementById("observaciones").value = "";

document.getElementById("salud").value = "";

}else if(data.trim() === "id_existente"){

alert("Ese ID/Caravana ya existe");

}else{

alert("Error: " + data);

}

});

}






function agregarFilaTabla(animal){

let tabla = document.getElementById("tablaAnimales");

let estadoTexto = animal.estado.toLowerCase();

let claseEstado = "";

if(estadoTexto === "vivo"){

claseEstado = "estado-vivo";

}
else if(estadoTexto === "vendido"){

claseEstado = "estado-vendido";

}
else if(estadoTexto === "fallecido"){

claseEstado = "estado-muerto";

}

tabla.innerHTML += `
<tr>

<td>${animal.id_animal}</td>

<td>${animal.raza}</td>

<td>${animal.sexo}</td>

<td>${animal.edad} años</td>

<td>${animal.peso} kg</td>

<td>${animal.salud}</td>

<td class="${claseEstado}">
${animal.estado}
</td>

<td>

<button onclick="actualizarAnimal(${animal.id})">
Actualizar
</button>

<button onclick="verHistorial(${animal.id})">
Historial
</button>

<button onclick="abrirMenuEstado(${animal.id})">
Estado
</button>

<button onclick="eliminarAnimal(${animal.id})">
Eliminar
</button>

</td>

</tr>
`;

}






function cargarAnimales(){

fetch("http://localhost/agroalerta/php/obtener_animales.php")

.then(res => res.json())

.then(data => {

let tabla = document.getElementById("tablaAnimales");

tabla.innerHTML = "";

data.forEach(animal => {

agregarFilaTabla(animal);

});

})

.catch(error => {

console.log(error);

});

}






function eliminarAnimal(id){

let confirmar = confirm(
"¿Seguro que deseas eliminar este animal?"
);

if(!confirmar){
return;
}

fetch("http://localhost/agroalerta/php/eliminar_animal.php", {

method: "POST",

headers: {
"Content-Type": "application/x-www-form-urlencoded"
},

body: `id=${id}`

})

.then(res => res.text())

.then(data => {

console.log("ELIMINAR:", data);

if(data.trim() === "ok"){

alert("Animal eliminado correctamente");

cargarAnimales();

}else{

alert("Error al eliminar: " + data);

}

})

.catch(error => {

console.log(error);

alert("Error de conexión");

});

}






function abrirMenuEstado(id){

let opcion = prompt(
`Selecciona el nuevo estado:

1 = Vivo
2 = Vendido
3 = Fallecido`
);

if(!opcion){
return;
}

let nuevoEstado = "";

if(opcion === "1"){
nuevoEstado = "Vivo";
}
else if(opcion === "2"){
nuevoEstado = "Vendido";
}
else if(opcion === "3"){
nuevoEstado = "Fallecido";
}
else{

alert("Opción inválida");
return;

}

actualizarEstado(id, nuevoEstado);

}






function actualizarEstado(id, estado){

fetch("http://localhost/agroalerta/php/actualizar_estado.php", {

method: "POST",

headers: {
"Content-Type": "application/x-www-form-urlencoded"
},

body:
`id=${encodeURIComponent(id)}
&estado=${encodeURIComponent(estado)}`

})

.then(res => res.text())

.then(data => {

console.log("ESTADO:", data);

if(data.trim() === "ok"){

alert("Estado actualizado correctamente");

cargarAnimales();

}else{

alert("Error: " + data);

}

})

.catch(error => {

console.log(error);

alert("Error de conexión");

});

}






function actualizarAnimal(id){

let nuevoPeso = prompt(
"Ingrese el nuevo peso del animal:"
);

if(nuevoPeso === null || nuevoPeso.trim() === ""){
return;
}

nuevoPeso = Number(nuevoPeso);

if(isNaN(nuevoPeso) || nuevoPeso < 45 || nuevoPeso > 1000){

alert("Peso inválido");
return;

}

let nuevoEstado = prompt(
`Nuevo estado:

1 = Vivo
2 = Vendido
3 = Fallecido`
);

if(!nuevoEstado){
return;
}

let estado = "";

if(nuevoEstado === "1"){

estado = "Vivo";

}
else if(nuevoEstado === "2"){

estado = "Vendido";

}
else if(nuevoEstado === "3"){

estado = "Fallecido";

}
else{

alert("Estado inválido");
return;

}

fetch("http://localhost/agroalerta/php/actualizar_animal.php", {

method: "POST",

headers:{
"Content-Type":"application/x-www-form-urlencoded"
},

body:
`id=${encodeURIComponent(id)}
&peso=${encodeURIComponent(nuevoPeso)}
&estado=${encodeURIComponent(estado)}`

})

.then(res => res.text())

.then(data => {

console.log("ACTUALIZAR:", data);

if(data.trim() === "ok"){

alert("Animal actualizado correctamente");

cargarAnimales();

}else{

alert("Error: " + data);

}

})

.catch(error => {

console.log(error);

alert("Error de conexión");

});

}






function verHistorial(id){

fetch(`http://localhost/agroalerta/php/obtener_historial.php?id=${id}`)

.then(res => res.json())

.then(data => {

if(data.length === 0){

alert("Este animal no tiene historial");
return;

}

let texto = "Historial del animal:\n\n";

data.forEach(item => {

texto +=
`Fecha: ${item.fecha}

Acción: ${item.accion}

Detalle:
${item.detalle}

----------------------------

`;

});

alert(texto);

})

.catch(error => {

console.log(error);

alert("Error al obtener historial");

});

}




function buscarAnimal(){

let filtro =
document.getElementById("buscar")
.value
.toLowerCase();

let filas =
document.querySelectorAll("#tablaAnimales tr");

filas.forEach(fila => {

let texto = fila.innerText.toLowerCase();

fila.style.display =
texto.includes(filtro)
? ""
: "none";

});

}






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

alert("⚠ El peso no coincide con el esperado para la edad");

return true;

}

return false;

}






function actualizarSalud(){

let peso =
Number(document.getElementById("peso").value);

let campoSalud =
document.getElementById("salud");

if(!peso){

campoSalud.value = "";

return;

}

campoSalud.value = calcularSalud(peso);

}






function actualizarProposito(){

let sexo =
document.getElementById("sexo").value;

let proposito =
document.getElementById("proposito");

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