<?php

session_start();

include("conexion.php");

if (!isset($_SESSION['usuario_id'])) {

    echo "no_session";
    exit();

}

if (!isset($_POST['id'])) {

    echo "error";
    exit();

}

$id = intval($_POST['id']);

$stmt = $conexion->prepare("
DELETE FROM usuarios
WHERE id = ?
");

$stmt->bind_param(
    "i",
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