<?php

session_start();

include("conexion.php");

if (!isset($_SESSION['usuario_id'])) {

    echo json_encode([]);
    exit();

}

if (!isset($_GET['id'])) {

    echo json_encode([]);
    exit();

}

$id = intval($_GET['id']);

$stmt = $conexion->prepare("
    SELECT
        peso_anterior,
        peso_nuevo,
        estado_anterior,
        estado_nuevo,
        fecha
    FROM historial_animales
    WHERE animal_id = ?
    ORDER BY fecha DESC
");

$stmt->bind_param("i", $id);

$stmt->execute();

$resultado = $stmt->get_result();

$historial = [];

while ($fila = $resultado->fetch_assoc()) {

    $historial[] = $fila;

}

header('Content-Type: application/json');

echo json_encode($historial);

$stmt->close();

$conexion->close();

?>