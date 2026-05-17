<?php

session_start();

include("conexion.php");

// 🔐 Verificar sesión

if (!isset($_SESSION['usuario_id'])) {

    echo "no_session";
    exit();

}

$usuario_id = $_SESSION['usuario_id'];

// 🔍 Verificar ID

if (!isset($_POST['id'])) {

    echo "error";
    exit();

}

$id = intval($_POST['id']);

// -------------------------------
// 🔍 OBTENER ESTADO ACTUAL
// -------------------------------

$buscar = $conexion->prepare("
    SELECT estado
    FROM animales
    WHERE id = ?
    AND usuario_id = ?
");

$buscar->bind_param(
    "ii",
    $id,
    $usuario_id
);

$buscar->execute();

$resultado = $buscar->get_result();

if ($resultado->num_rows <= 0) {

    echo "animal_no_encontrado";
    exit();

}

$animal = $resultado->fetch_assoc();

$estadoAnterior = $animal['estado'];

$buscar->close();

// -------------------------------
// 💾 GUARDAR HISTORIAL
// -------------------------------

$historial = $conexion->prepare("
    INSERT INTO historial_animales
    (
        animal_id,
        estado_anterior,
        estado_nuevo
    )
    VALUES (?, ?, ?)
");

$estadoNuevo = "Eliminado";

$historial->bind_param(
    "iss",
    $id,
    $estadoAnterior,
    $estadoNuevo
);

$historial->execute();

$historial->close();

// -------------------------------
// 🗑 ELIMINAR ANIMAL
// -------------------------------

$stmt = $conexion->prepare("
    DELETE FROM animales
    WHERE id = ?
    AND usuario_id = ?
");

$stmt->bind_param(
    "ii",
    $id,
    $usuario_id
);

if ($stmt->execute()) {

    echo "ok";

} else {

    echo "error_sql";

}

$stmt->close();

$conexion->close();

?>