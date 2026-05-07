<?php
include("conexion.php");

// -------------------------------
// 🔐 VALIDAR QUE LLEGUEN DATOS
// -------------------------------
if (
    !isset($_POST['usuario']) ||
    !isset($_POST['password']) ||
    !isset($_POST['cedula']) ||
    !isset($_POST['celular']) ||
    !isset($_POST['licose'])
) {
    echo "error";
    exit();
}

// -------------------------------
// 🧹 LIMPIAR DATOS
// -------------------------------
$usuario = trim($_POST['usuario']);
$password = trim($_POST['password']);
$cedula = trim($_POST['cedula']);
$celular = trim($_POST['celular']);
$licose = trim($_POST['licose']);

// -------------------------------
// ❌ VALIDAR VACÍOS
// -------------------------------
if (
    empty($usuario) ||
    empty($password) ||
    empty($cedula) ||
    empty($celular) ||
    empty($licose)
) {
    echo "error";
    exit();
}

// -------------------------------
// 🔒 VALIDACIONES FUERTES
// -------------------------------

// Password: mínimo 8, 1 mayúscula, 1 símbolo
if (!preg_match('/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/', $password)) {
    echo "password_insegura";
    exit();
}

// Cédula: exactamente 8 números
if (!preg_match('/^[0-9]{8}$/', $cedula)) {
    echo "cedula_invalida";
    exit();
}

// Celular: exactamente 9 números
if (!preg_match('/^[0-9]{9}$/', $celular)) {
    echo "celular_invalido";
    exit();
}

// LICOSE: 12 caracteres alfanuméricos
if (!preg_match('/^[A-Za-z0-9]{12}$/', $licose)) {
    echo "licose_invalido";
    exit();
}

// -------------------------------
// 🔍 VERIFICAR USUARIO EXISTENTE
// -------------------------------
$check = $conexion->prepare("SELECT id FROM usuarios WHERE usuario = ?");
$check->bind_param("s", $usuario);
$check->execute();
$res = $check->get_result();

if ($res->num_rows > 0) {
    echo "existe";
    exit();
}

// -------------------------------
// 🔐 HASH DE PASSWORD (IMPORTANTE)
// -------------------------------
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// -------------------------------
// 💾 INSERTAR USUARIO
// -------------------------------
$stmt = $conexion->prepare("
    INSERT INTO usuarios (usuario, password, cedula, celular, licose)
    VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param("sssss", $usuario, $passwordHash, $cedula, $celular, $licose);

if ($stmt->execute()) {
    echo "ok";
} else {
    echo "error:" . $stmt->error;
}

$stmt->close();
$conexion->close();
?>