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

// Evitar usuarios duplicados
$check = $conexion->prepare("SELECT id FROM usuarios WHERE usuario = ?");
$check->bind_param("s", $usuario);
$check->execute();
$res = $check->get_result();

if ($res->num_rows > 0) {
    echo "existe";
    exit();
}

$stmt = $conexion->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?)");
$stmt->bind_param("ss", $usuario, $password);

if ($stmt->execute()) {
    echo "ok";
} else {
    echo "error:" . $stmt->error; // 🔥 DEBUG REAL
}

$stmt->close();
$conexion->close();
?>