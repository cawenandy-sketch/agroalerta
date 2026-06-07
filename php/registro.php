<?php

include("conexion.php");

// -------------------------------
// VALIDAR DATOS
// -------------------------------

if (
    !isset($_POST['nombre']) ||
    !isset($_POST['apellido']) ||
    !isset($_POST['correo']) ||
    !isset($_POST['password']) ||
    !isset($_POST['cedula']) ||
    !isset($_POST['celular']) ||
    !isset($_POST['licose']) ||
    !isset($_POST['tipo_usuario'])
) {

    echo "error";
    exit();

}

// -------------------------------
// LIMPIAR DATOS
// -------------------------------

$nombre = trim($_POST['nombre']);

$apellido = trim($_POST['apellido']);

$correo = trim($_POST['correo']);

$password = trim($_POST['password']);

$cedula = trim($_POST['cedula']);

$celular = trim($_POST['celular']);

$licose = trim($_POST['licose']);

$tipo_usuario = trim($_POST['tipo_usuario']);

$codigo_admin = isset($_POST['codigo_admin'])
    ? trim($_POST['codigo_admin'])
    : "";

// -------------------------------
// VALIDAR VACÍOS
// -------------------------------

if (
    empty($nombre) ||
    empty($apellido) ||
    empty($correo) ||
    empty($password) ||
    empty($cedula) ||
    empty($celular) ||
    empty($licose) ||
    empty($tipo_usuario)
) {

    echo "error";
    exit();

}

// -------------------------------
// VALIDAR CORREO
// -------------------------------

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {

    echo "correo_invalido";
    exit();

}

// -------------------------------
// VALIDACIONES
// -------------------------------

// Password segura

if (!preg_match('/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/', $password)) {

    echo "password_insegura";
    exit();

}

// Cedula

if (!preg_match('/^[0-9]{8}$/', $cedula)) {

    echo "cedula_invalida";
    exit();

}

// Celular

if (!preg_match('/^[0-9]{9}$/', $celular)) {

    echo "celular_invalido";
    exit();

}

// Licose

if (!preg_match('/^[A-Za-z0-9]{12}$/', $licose)) {

    echo "licose_invalido";
    exit();

}

// Tipo usuario

if (
    $tipo_usuario !== "ganadero" &&
    $tipo_usuario !== "administrador"
) {

    echo "tipo_invalido";
    exit();

}

// -------------------------------
// CÓDIGO SECRETO ADMIN
// -------------------------------

if ($tipo_usuario === "administrador") {

    if ($codigo_admin !== "AGROADMIN2026") {

        echo "codigo_admin_invalido";
        exit();

    }

}

// -------------------------------
// DEFINIR ROL
// -------------------------------

$rol = $tipo_usuario;

// -------------------------------
// VERIFICAR CORREO EXISTENTE
// -------------------------------

$check = $conexion->prepare("
    SELECT id
    FROM usuarios
    WHERE correo = ?
");

$check->bind_param("s", $correo);

$check->execute();

$res = $check->get_result();

if ($res->num_rows > 0) {

    echo "correo_existente";
    exit();

}

// -------------------------------
// HASH PASSWORD
// -------------------------------

$passwordHash = password_hash(
    $password,
    PASSWORD_DEFAULT
);

// -------------------------------
// INSERTAR USUARIO
// -------------------------------

$stmt = $conexion->prepare("
    INSERT INTO usuarios
    (
        nombre,
        apellido,
        correo,
        password,
        cedula,
        celular,
        licose,
        tipo_usuario,
        rol
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "sssssssss",
    $nombre,
    $apellido,
    $correo,
    $passwordHash,
    $cedula,
    $celular,
    $licose,
    $tipo_usuario,
    $rol
);

if ($stmt->execute()) {

    echo "ok";

} else {

    echo "error:" . $stmt->error;

}

$stmt->close();

$conexion->close();

?>