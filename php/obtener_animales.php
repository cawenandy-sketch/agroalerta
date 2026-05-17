<?php

session_start();

include("conexion.php");

// -------------------------------
// 🔐 VERIFICAR SESIÓN
// -------------------------------

if (!isset($_SESSION['usuario_id'])) {

    echo json_encode([]);
    exit();

}

$usuario_id = $_SESSION['usuario_id'];

// -------------------------------
// 🔍 OBTENER ANIMALES
// -------------------------------

$stmt = $conexion->prepare("
    SELECT 
        id,
        id_animal,
        raza,
        sexo,
        edad,
        peso,
        salud,
        estado
    FROM animales
    WHERE usuario_id = ?
    ORDER BY id DESC
");

$stmt->bind_param("i", $usuario_id);

$stmt->execute();

$resultado = $stmt->get_result();

// -------------------------------
// 📦 ARMAR ARRAY
// -------------------------------

$animales = [];

while ($fila = $resultado->fetch_assoc()) {

    $animales[] = $fila;

}

// -------------------------------
// 📤 DEVOLVER JSON
// -------------------------------

header('Content-Type: application/json');

echo json_encode($animales);

$stmt->close();
$conexion->close();

?>