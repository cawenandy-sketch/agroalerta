<?php

session_start();

include("conexion.php");

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
    !isset($_POST['id']) ||
    !isset($_POST['estado'])
) {

    echo "error";
    exit();

}

$id = intval($_POST['id']);

$estado = trim($_POST['estado']);

// -------------------------------
// ✅ ESTADOS VÁLIDOS
// -------------------------------

$estadosValidos = [
    "Vivo",
    "Vendido",
    "Fallecido"
];

if (!in_array($estado, $estadosValidos)) {

    echo "estado_invalido";
    exit();

}

// -------------------------------
// 🔍 OBTENER ESTADO ANTERIOR
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
// 🔄 ACTUALIZAR ESTADO
// -------------------------------

$stmt = $conexion->prepare("
    UPDATE animales
    SET estado = ?
    WHERE id = ?
    AND usuario_id = ?
");

$stmt->bind_param(
    "sii",
    $estado,
    $id,
    $usuario_id
);

// -------------------------------
// 💾 GUARDAR HISTORIAL
// -------------------------------

if ($stmt->execute()) {

    $historial = $conexion->prepare("
        INSERT INTO historial_animales
        (
            animal_id,
            estado_anterior,
            estado_nuevo
        )
        VALUES (?, ?, ?)
    ");

    $historial->bind_param(
        "iss",
        $id,
        $estadoAnterior,
        $estado
    );

    $historial->execute();

    $historial->close();

    echo "ok";

} else {

    echo "error_sql";

}

$stmt->close();
$conexion->close();

?>