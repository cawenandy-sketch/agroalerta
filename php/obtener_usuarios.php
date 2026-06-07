<?php

session_start();

include("conexion.php");

if (!isset($_SESSION['usuario_id'])) {

    echo json_encode([]);
    exit();
}

$sql = "
SELECT
id,
nombre,
apellido,
correo,
cedula,
celular,
licose,
tipo_usuario
FROM usuarios
ORDER BY id DESC
";

$resultado = $conexion->query($sql);

$usuarios = [];

while ($fila = $resultado->fetch_assoc()) {

    $usuarios[] = $fila;
}

header("Content-Type: application/json");

echo json_encode($usuarios);

$conexion->close();

?>