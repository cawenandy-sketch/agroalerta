<?php

session_start();

include("conexion.php");

if(!isset($_SESSION['usuario_id'])){

    echo "no_session";
    exit();

}

if(
!isset($_POST['id']) ||
!isset($_POST['peso']) ||
!isset($_POST['estado'])
){

    echo "faltan_datos";
    exit();

}

$id = intval($_POST['id']);

$pesoNuevo = floatval($_POST['peso']);

$estadoNuevo = trim($_POST['estado']);

$usuario_id = $_SESSION['usuario_id'];

// --------------------
// OBTENER DATOS ANTERIORES
// --------------------

$buscar = $conexion->prepare("
SELECT peso, estado
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

if($resultado->num_rows === 0){

    echo "animal_no_encontrado";
    exit();

}

$animal = $resultado->fetch_assoc();

$pesoAnterior = $animal['peso'];

$estadoAnterior = $animal['estado'];

// --------------------
// CALCULAR SALUD
// --------------------

$salud = "";

if ($pesoNuevo >= 45 && $pesoNuevo <= 150) {

    $salud = "En tratamiento";

}
else if ($pesoNuevo >= 151 && $pesoNuevo <= 350) {

    $salud = "En observación";

}
else if ($pesoNuevo >= 351 && $pesoNuevo <= 800) {

    $salud = "Saludable";

}
else {

    $salud = "Sobrepeso";

}

// --------------------
// ACTUALIZAR ANIMAL
// --------------------

$stmt = $conexion->prepare("
UPDATE animales
SET
peso = ?,
salud = ?,
estado = ?
WHERE id = ?
AND usuario_id = ?
");

$stmt->bind_param(
"dssii",
$pesoNuevo,
$salud,
$estadoNuevo,
$id,
$usuario_id
);

if($stmt->execute()){

    // --------------------
    // GUARDAR HISTORIAL
    // --------------------

    $historial = $conexion->prepare("
    INSERT INTO historial_animales
    (
        animal_id,
        peso_anterior,
        peso_nuevo,
        estado_anterior,
        estado_nuevo
    )
    VALUES (?, ?, ?, ?, ?)
    ");

    $historial->bind_param(
    "iddss",
    $id,
    $pesoAnterior,
    $pesoNuevo,
    $estadoAnterior,
    $estadoNuevo
    );

    $historial->execute();

    echo "ok";

}else{

    echo "error_sql";

}

$stmt->close();

$conexion->close();

?>