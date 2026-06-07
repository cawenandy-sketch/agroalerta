<?php

session_start();

include("conexion.php");

$sql = "
SELECT *
FROM auditoria_admin
ORDER BY fecha DESC
";

$resultado = $conexion->query($sql);

$registros = [];

while($fila = $resultado->fetch_assoc()){

    $registros[] = $fila;

}

header("Content-Type: application/json");

echo json_encode($registros);

$conexion->close();

?>