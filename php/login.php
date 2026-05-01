<?php
include("conexion.php");

if (!isset($_POST['usuario']) || !isset($_POST['password'])) {
    echo "error";
    exit();
}

$usuario = trim($_POST['usuario']);
$password = trim($_POST['password']);

if (empty($usuario) || empty($password)) {
    echo "error";
    exit();
}

$stmt = $conexion->prepare("SELECT id FROM usuarios WHERE usuario = ? AND password = ?");
$stmt->bind_param("ss", $usuario, $password);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    echo "ok";
} else {
    echo "error";
}

$stmt->close();
$conexion->close();
?>