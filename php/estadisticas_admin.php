<?php

session_start();

include("conexion.php");

if (!isset($_SESSION['usuario_id'])) {

    echo json_encode([
        "error" => "no_session"
    ]);

    exit();
}

$totalUsuarios = 0;
$totalAnimales = 0;
$totalAdmins = 0;

// ---------------------
// USUARIOS
// ---------------------

$sqlUsuarios = "
SELECT COUNT(*) AS total
FROM usuarios
";

$resUsuarios = $conexion->query($sqlUsuarios);

if($resUsuarios){

    $fila = $resUsuarios->fetch_assoc();

    $totalUsuarios = $fila['total'];
}

// ---------------------
// ANIMALES
// ---------------------

$sqlAnimales = "
SELECT COUNT(*) AS total
FROM animales
";

$resAnimales = $conexion->query($sqlAnimales);

if($resAnimales){

    $fila = $resAnimales->fetch_assoc();

    $totalAnimales = $fila['total'];
}

// ---------------------
// ADMINISTRADORES
// ---------------------

$sqlAdmins = "
SELECT COUNT(*) AS total
FROM usuarios
WHERE tipo_usuario = 'administrador'
";

$resAdmins = $conexion->query($sqlAdmins);

if($resAdmins){

    $fila = $resAdmins->fetch_assoc();

    $totalAdmins = $fila['total'];
}

// ---------------------
// RESPUESTA
// ---------------------

echo json_encode([
    "usuarios" => $totalUsuarios,
    "animales" => $totalAnimales,
    "administradores" => $totalAdmins
]);

$conexion->close();

?>