<?php

session_start();

include("conexion.php");

if (!isset($_SESSION['usuario_id'])) {

    echo "no_session";
    exit();

}

if (
    !isset($_POST['id']) ||
    !isset($_POST['rol'])
) {

    echo "error";
    exit();

}

$id = intval($_POST['id']);

$rol = $_POST['rol'];

if (
    $rol !== "ganadero" &&
    $rol !== "administrador"
) {

    echo "rol_invalido";
    exit();

}

$stmt = $conexion->prepare("
UPDATE usuarios
SET tipo_usuario = ?
WHERE id = ?
");

$stmt->bind_param(
    "si",
    $rol,
    $id
);

if ($stmt->execute()) {

    echo "ok";

} else {

    echo "error_sql";

}

$stmt->close();
$conexion->close();

?>