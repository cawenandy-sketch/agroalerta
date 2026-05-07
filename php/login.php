<?php
include("conexion.php");

// -------------------------------
// 🔐 VALIDAR DATOS
// -------------------------------

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

// -------------------------------
// 🔍 BUSCAR USUARIO
// -------------------------------

$stmt = $conexion->prepare("
    SELECT password 
    FROM usuarios 
    WHERE usuario = ?
");

$stmt->bind_param("s", $usuario);
$stmt->execute();

$resultado = $stmt->get_result();

// -------------------------------
// ❌ USUARIO NO EXISTE
// -------------------------------

if ($resultado->num_rows <= 0) {
    echo "error";
    exit();
}

// -------------------------------
// 🔐 VERIFICAR PASSWORD HASH
// -------------------------------

$datos = $resultado->fetch_assoc();

$passwordHash = $datos['password'];

if (password_verify($password, $passwordHash)) {
    echo "ok";
} else {
    echo "error";
}

$stmt->close();
$conexion->close();
?>