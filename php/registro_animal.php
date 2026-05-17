<?php

session_start();

include("conexion.php");
include("guardar_historial.php");

// -------------------------------
// 🔐 VERIFICAR SESIÓN
// -------------------------------

if (!isset($_SESSION['usuario_id'])) {

    echo "no_session";
    exit();

}

$usuario_id = $_SESSION['usuario_id'];

// -------------------------------
// 🔍 VALIDAR DATOS
// -------------------------------

if (
    !isset($_POST['id_animal']) ||
    !isset($_POST['raza']) ||
    !isset($_POST['sexo']) ||
    !isset($_POST['proposito']) ||
    !isset($_POST['edad']) ||
    !isset($_POST['peso']) ||
    !isset($_POST['observaciones'])
) {

    echo "error";
    exit();

}

// -------------------------------
// 🧹 LIMPIAR DATOS
// -------------------------------

$id_animal = trim($_POST['id_animal']);

$raza = trim($_POST['raza']);

$sexo = trim($_POST['sexo']);

$proposito = trim($_POST['proposito']);

$edad = intval($_POST['edad']);

$peso = floatval($_POST['peso']);

$observaciones = trim($_POST['observaciones']);

$estado = "Vivo";

// -------------------------------
// ❌ CAMPOS VACÍOS
// -------------------------------

if (
    empty($id_animal) ||
    empty($raza) ||
    empty($sexo) ||
    empty($proposito) ||
    empty($edad) ||
    empty($peso)
) {

    echo "campos_vacios";
    exit();

}

// -------------------------------
// 🐄 VALIDACIONES GANADERAS
// -------------------------------

// Edad

if ($edad < 0 || $edad > 20) {

    echo "edad_invalida";
    exit();

}

// Peso

if ($peso < 45 || $peso > 1000) {

    echo "peso_invalido";
    exit();

}

// Machos no producen leche

if (
    $sexo === "Macho" &&
    $proposito === "Producción de leche"
) {

    echo "proposito_invalido";
    exit();

}

// -------------------------------
// ❤️ CALCULAR SALUD
// -------------------------------

$salud = "";

if ($peso >= 45 && $peso <= 150) {

    $salud = "En tratamiento";

}
else if ($peso >= 151 && $peso <= 350) {

    $salud = "En observación";

}
else if ($peso >= 351 && $peso <= 800) {

    $salud = "Saludable";

}
else {

    $salud = "Sobrepeso";

}

// -------------------------------
// 🔍 VERIFICAR ID REPETIDO
// -------------------------------

$check = $conexion->prepare("
    SELECT id
    FROM animales
    WHERE id_animal = ?
    AND usuario_id = ?
");

$check->bind_param(
    "si",
    $id_animal,
    $usuario_id
);

$check->execute();

$resultado = $check->get_result();

if ($resultado->num_rows > 0) {

    echo "id_existente";
    exit();

}

// -------------------------------
// 💾 INSERTAR ANIMAL
// -------------------------------

$stmt = $conexion->prepare("
    INSERT INTO animales
    (
        usuario_id,
        id_animal,
        raza,
        sexo,
        proposito,
        edad,
        peso,
        salud,
        estado,
        observaciones
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "issssiidss",
    $usuario_id,
    $id_animal,
    $raza,
    $sexo,
    $proposito,
    $edad,
    $peso,
    $salud,
    $estado,
    $observaciones
);

if ($stmt->execute()) {

    $animal_id_mysql = $stmt->insert_id;

    guardarHistorial(
        $conexion,
        $animal_id_mysql,
        "Registro",
        "Animal registrado correctamente"
    );

    echo "ok";

} else {

    echo "error_sql";

}

$stmt->close();

$conexion->close();

?>