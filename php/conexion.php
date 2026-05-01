<?php
$conexion = new mysqli("localhost", "root", "", "agroalerta");

// Verificar conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Opcional pero recomendable (acentos)
$conexion->set_charset("utf8");
?>