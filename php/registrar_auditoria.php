<?php

include("conexion.php");

$admin_id = $_POST['admin_id'];
$accion = $_POST['accion'];

$stmt = $conexion->prepare("
INSERT INTO auditoria_admin
(admin_id, accion)
VALUES (?, ?)
");

$stmt->bind_param(
    "is",
    $admin_id,
    $accion
);

$stmt->execute();

$stmt->close();

?>