<?php

session_start();

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

$stmt = $conexion->prepare("
    SELECT id, usuario, password
    FROM usuarios
    WHERE usuario = ?
");

$stmt->bind_param("s", $usuario);

$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows <= 0) {
    echo "error";
    exit();
}

$datos = $resultado->fetch_assoc();

$passwordHash = $datos['password'];

if (password_verify($password, $passwordHash)) {

    $_SESSION['usuario_id'] = $datos['id'];
    $_SESSION['usuario'] = $datos['usuario'];

    echo "ok";

} else {

    echo "error";

}

$stmt->close();
$conexion->close();

?>