<?php

include("conexion.php");

function guardarHistorial($conexion, $animal_id, $accion, $detalle){

$stmt = $conexion->prepare("
INSERT INTO historial_animales
(
animal_id,
accion,
detalle
)
VALUES (?, ?, ?)
");

$stmt->bind_param(
"iss",
$animal_id,
$accion,
$detalle
);

$stmt->execute();

$stmt->close();

}

?>