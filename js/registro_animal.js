
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

});




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


agregarFilaTabla({
id, raza, sexo, edad, peso, salud, estado, observaciones
});


document.getElementById("idAnimal").value="";
document.getElementById("edad").value="";
document.getElementById("peso").value="";
document.getElementById("observaciones").value="";

document.getElementById("salud").value="";

}




function agregarFilaTabla(animal){

let tabla = document.getElementById("tablaAnimales");

let claseEstado = animal.estado === "vivo" ? "estado-vivo" : "estado-muerto";

tabla.innerHTML += `
<tr>
<td>${animal.id}</td>
<td>${animal.raza}</td>
<td>${animal.sexo}</td>
<td>${animal.edad} años</td>
<td>${animal.peso} kg</td>
<td>${animal.salud}</td>
<td class="${claseEstado}">${animal.estado}</td>
<td>
<button disabled>Actualizar</button>
<button disabled>Historial</button>
<button disabled>Estado</button>
<button disabled>Eliminar</button>
</td>
</tr>
`;

}




function buscarAnimal(){

let filtro = document.getElementById("buscar").value.toLowerCase();
let filas = document.querySelectorAll("#tablaAnimales tr");

filas.forEach(fila=>{
let texto = fila.innerText.toLowerCase();
fila.style.display = texto.includes(filtro) ? "" : "none";
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

let peso = Number(document.getElementById("peso").value);
let campoSalud = document.getElementById("salud");

if(!peso){
campoSalud.value = "";
return;
}

campoSalud.value = calcularSalud(peso);

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