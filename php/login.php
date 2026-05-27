<?php

session_start();

include("conexion.php");

// -------------------------------
// VALIDAR DATOS
// -------------------------------

if (
    !isset($_POST['correo']) ||
    !isset($_POST['password'])
) {

    echo "error";
    exit();

}

// -------------------------------
// LIMPIAR DATOS
// -------------------------------

$correo = trim($_POST['correo']);

$password = trim($_POST['password']);

// -------------------------------
// VALIDAR VACÍOS
// -------------------------------

if (
    empty($correo) ||
    empty($password)
) {

    echo "error";
    exit();

}

// -------------------------------
// VALIDAR FORMATO CORREO
// -------------------------------

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {

    echo "correo_invalido";
    exit();

}

// -------------------------------
// BUSCAR USUARIO
// -------------------------------

$stmt = $conexion->prepare("
    SELECT
        id,
        nombre,
        apellido,
        correo,
        password,
        tipo_usuario
    FROM usuarios
    WHERE correo = ?
");

$stmt->bind_param("s", $correo);

$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows <= 0) {

    echo "error";
    exit();

}

$datos = $resultado->fetch_assoc();

$passwordHash = $datos['password'];

// -------------------------------
// VERIFICAR PASSWORD
// -------------------------------

if (password_verify($password, $passwordHash)) {

    $_SESSION['usuario_id'] = $datos['id'];

    $_SESSION['nombre'] = $datos['nombre'];

    $_SESSION['apellido'] = $datos['apellido'];

    $_SESSION['correo'] = $datos['correo'];

    $_SESSION['tipo_usuario'] = $datos['tipo_usuario'];

    echo "ok";

} else {

    echo "error";

}

$stmt->close();

$conexion->close();

?>