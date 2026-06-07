<?php

session_start();

include("conexion.php");
include("guardar_historial.php");

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
    !isset($_POST['id'])     ||
    !isset($_POST['peso'])   ||
    !isset($_POST['estado']) ||
    !isset($_POST['observaciones'])
) {
    echo "faltan_datos";
    exit();
}

// --------------------
// LIMPIAR DATOS
// --------------------

$id            = intval($_POST['id']);
$peso          = floatval($_POST['peso']);
$estado        = trim($_POST['estado']);
$observaciones = trim($_POST['observaciones']);

// --------------------
// VALIDAR PESO
// --------------------

if ($peso < 45 || $peso > 1000) {
    echo "peso_invalido";
    exit();
}

// --------------------
// VALIDAR ESTADO
// --------------------

$estadosValidos = ["Vivo", "Vendido", "Fallecido"];

if (!in_array($estado, $estadosValidos)) {
    echo "estado_invalido";
    exit();
}

// --------------------
// VERIFICAR QUE EL ANIMAL EXISTE
// --------------------

$check = $conexion->prepare("
    SELECT id, peso, estado
    FROM animales
    WHERE id = ?
");

$check->bind_param("i", $id);
$check->execute();
$res = $check->get_result();

if ($res->num_rows === 0) {
    echo "animal_no_encontrado";
    exit();
}

$animal       = $res->fetch_assoc();
$pesoAnterior  = $animal['peso'];
$estadoAnterior = $animal['estado'];

$check->close();

// --------------------
// CALCULAR SALUD SEGÚN PESO
// --------------------

if ($peso >= 45 && $peso <= 150) {
    $salud = "En tratamiento";
} else if ($peso >= 151 && $peso <= 350) {
    $salud = "En observación";
} else if ($peso >= 351 && $peso <= 800) {
    $salud = "Saludable";
} else {
    $salud = "Sobrepeso";
}

// --------------------
// ACTUALIZAR ANIMAL
// --------------------

$stmt = $conexion->prepare("
    UPDATE animales
    SET
        peso          = ?,
        salud         = ?,
        estado        = ?,
        observaciones = ?
    WHERE id = ?
");

$stmt->bind_param(
    "dsssi",
    $peso,
    $salud,
    $estado,
    $observaciones,
    $id
);

if ($stmt->execute()) {

    // Guardar en historial del animal
    guardarHistorial(
        $conexion,
        $id,
        "Edición admin",
        "Peso: $pesoAnterior kg → $peso kg | Estado: $estadoAnterior → $estado"
    );

    // Registrar en auditoría admin
    $admin_id = $_SESSION['usuario_id'];

    $log = $conexion->prepare("
        INSERT INTO auditoria_admin
        (admin_id, accion)
        VALUES (?, ?)
    ");

    $accion = "Editó animal ID $id (Peso: $pesoAnterior → $peso kg | Estado: $estadoAnterior → $estado)";

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