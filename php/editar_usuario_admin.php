<?php

session_start();

include("conexion.php");

// --------------------
// VERIFICAR SESIÓN
// --------------------

if (!isset($_SESSION['usuario_id'])) {
    echo "no_session";
    exit();
}

// --------------------
// VALIDAR DATOS
// --------------------

if (
    !isset($_POST['id'])       ||
    !isset($_POST['nombre'])   ||
    !isset($_POST['apellido']) ||
    !isset($_POST['correo'])   ||
    !isset($_POST['celular'])  ||
    !isset($_POST['licose'])   ||
    !isset($_POST['rol'])
) {
    echo "faltan_datos";
    exit();
}

// --------------------
// LIMPIAR DATOS
// --------------------

$id       = intval($_POST['id']);
$nombre   = trim($_POST['nombre']);
$apellido = trim($_POST['apellido']);
$correo   = trim($_POST['correo']);
$celular  = trim($_POST['celular']);
$licose   = trim($_POST['licose']);
$rol      = trim($_POST['rol']);

// --------------------
// VALIDAR VACÍOS
// --------------------

if (
    empty($nombre)   ||
    empty($apellido) ||
    empty($correo)
) {
    echo "campos_vacios";
    exit();
}

// --------------------
// VALIDAR CORREO
// --------------------

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo "correo_invalido";
    exit();
}

// --------------------
// VALIDAR ROL
// --------------------

if ($rol !== "ganadero" && $rol !== "administrador") {
    echo "rol_invalido";
    exit();
}

// --------------------
// VERIFICAR QUE EL USUARIO EXISTE
// --------------------

$check = $conexion->prepare("
    SELECT id
    FROM usuarios
    WHERE id = ?
");

$check->bind_param("i", $id);
$check->execute();
$res = $check->get_result();

if ($res->num_rows === 0) {
    echo "usuario_no_encontrado";
    exit();
}

$check->close();

// --------------------
// VERIFICAR CORREO DUPLICADO
// (que no lo use otro usuario)
// --------------------

$checkCorreo = $conexion->prepare("
    SELECT id
    FROM usuarios
    WHERE correo = ?
    AND id != ?
");

$checkCorreo->bind_param("si", $correo, $id);
$checkCorreo->execute();
$resCorreo = $checkCorreo->get_result();

if ($resCorreo->num_rows > 0) {
    echo "correo_existente";
    exit();
}

$checkCorreo->close();

// --------------------
// ACTUALIZAR USUARIO
// --------------------

$stmt = $conexion->prepare("
    UPDATE usuarios
    SET
        nombre      = ?,
        apellido    = ?,
        correo      = ?,
        celular     = ?,
        licose      = ?,
        tipo_usuario = ?,
        rol         = ?
    WHERE id = ?
");

$stmt->bind_param(
    "sssssssi",
    $nombre,
    $apellido,
    $correo,
    $celular,
    $licose,
    $rol,
    $rol,
    $id
);

if ($stmt->execute()) {

    // Registrar en auditoría
    $admin_id = $_SESSION['usuario_id'];

    $log = $conexion->prepare("
        INSERT INTO auditoria_admin
        (admin_id, accion)
        VALUES (?, ?)
    ");

    $accion = "Editó datos del usuario ID $id ($nombre $apellido)";

    $log->bind_param("is", $admin_id, $accion);
    $log->execute();
    $log->close();

    echo "ok";

} else {
    echo "error_sql";
}

$stmt->close();
$conexion->close();

?>