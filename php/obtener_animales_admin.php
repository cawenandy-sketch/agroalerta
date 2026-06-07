<?php

session_start();

include("conexion.php");

if (!isset($_SESSION['usuario_id'])) {

    echo json_encode([]);
    exit();

}

$sql = "

SELECT

    animales.id,
    animales.id_animal,
    animales.raza,
    animales.sexo,
    animales.edad,
    animales.peso,
    animales.salud,
    animales.estado,
    animales.observaciones,
    animales.fecha_registro,

    usuarios.nombre,
    usuarios.apellido

FROM animales

INNER JOIN usuarios
ON animales.usuario_id = usuarios.id

ORDER BY animales.id DESC

";

$resultado = $conexion->query($sql);

$animales = [];

while($fila = $resultado->fetch_assoc()){

    $animales[] = $fila;

}

header("Content-Type: application/json");

echo json_encode($animales);

$conexion->close();

?>