-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-06-2026 a las 04:24:25
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `agroalerta`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `animales`
--

CREATE TABLE `animales` (
  `id` int(11) NOT NULL,
  `id_animal` varchar(20) NOT NULL,
  `raza` varchar(50) NOT NULL,
  `sexo` enum('Macho','Hembra') NOT NULL,
  `proposito` enum('Engorde','Reproducción','Producción de leche') NOT NULL,
  `edad` int(11) NOT NULL,
  `peso` decimal(6,2) NOT NULL,
  `salud` enum('Saludable','En observación','En tratamiento','Sobrepeso') NOT NULL DEFAULT 'En observación',
  `estado` enum('Vivo','Vendido','Fallecido') NOT NULL DEFAULT 'Vivo',
  `observaciones` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `usuario_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `animales`
--

INSERT INTO `animales` (`id`, `id_animal`, `raza`, `sexo`, `proposito`, `edad`, `peso`, `salud`, `estado`, `observaciones`, `fecha_registro`, `usuario_id`) VALUES
(9, '104', 'Angus', 'Macho', 'Engorde', 1, 249.00, '', 'Fallecido', '', '2026-05-27 20:21:22', 17),
(11, '1012', 'Angus', 'Macho', 'Engorde', 3, 498.00, '', 'Vivo', '', '2026-05-30 17:23:37', 17),
(12, '1018', 'Hereford', 'Hembra', 'Producción de leche', 4, 598.00, '', 'Vendido', '', '2026-06-07 21:15:12', 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria_admin`
--

CREATE TABLE `auditoria_admin` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `accion` varchar(255) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `auditoria_admin`
--

INSERT INTO `auditoria_admin` (`id`, `admin_id`, `accion`, `fecha`) VALUES
(1, 18, 'Eliminó usuario ID 10', '2026-06-07 20:43:54'),
(2, 18, 'Eliminó usuario ID 11', '2026-06-07 20:44:08'),
(3, 0, 'Cambió el rol del usuario ID 17 a \"administrador\"', '2026-06-07 21:07:44'),
(4, 17, 'Cambió el rol del usuario ID 17 a \"ganadero\"', '2026-06-07 21:13:59'),
(5, 18, 'Editó datos del usuario ID 16 (alberto perez)', '2026-06-08 00:46:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_animales`
--

CREATE TABLE `historial_animales` (
  `id` int(11) NOT NULL,
  `animal_id` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `accion` varchar(100) NOT NULL,
  `detalle` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_animales`
--

INSERT INTO `historial_animales` (`id`, `animal_id`, `fecha`, `accion`, `detalle`) VALUES
(1, 5, '2026-05-17 22:21:44', '', ''),
(2, 5, '2026-05-17 22:24:14', '', ''),
(3, 5, '2026-05-17 22:29:15', '', ''),
(4, 10, '2026-05-27 20:31:43', 'Registro', 'Animal registrado correctamente'),
(5, 10, '2026-05-30 15:01:46', 'Eliminación', 'Animal eliminado. Estado anterior: Vivo'),
(6, 8, '2026-05-30 15:01:54', 'Eliminación', 'Animal eliminado. Estado anterior: Vivo'),
(7, 6, '2026-05-30 15:02:06', 'Actualización', 'Peso: 249.00 kg -> 150 kg | Estado: Vivo -> Fallecido'),
(8, 6, '2026-05-30 15:02:24', 'Cambio de estado', 'Estado cambiado de Fallecido a Vendido'),
(9, 6, '2026-05-30 15:02:40', 'Actualización', 'Peso: 150.00 kg -> 30000 kg | Estado: Vendido -> Vivo'),
(10, 11, '2026-05-30 17:23:37', 'Registro', 'Animal registrado correctamente'),
(11, 9, '2026-05-30 17:39:50', 'Cambio de estado', 'Estado cambiado de Vivo a Fallecido'),
(12, 7, '2026-05-30 17:39:55', 'Eliminación', 'Animal eliminado. Estado anterior: Vivo'),
(13, 6, '2026-05-30 17:39:59', 'Eliminación', 'Animal eliminado. Estado anterior: Vivo'),
(14, 12, '2026-06-07 21:15:12', 'Registro', 'Animal registrado correctamente'),
(15, 12, '2026-06-07 21:15:21', 'Cambio de estado', 'Estado cambiado de Vivo a Vendido');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `cedula` varchar(8) NOT NULL,
  `celular` varchar(9) NOT NULL,
  `licose` varchar(12) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `tipo_usuario` varchar(20) DEFAULT 'ganadero',
  `correo` varchar(100) DEFAULT NULL,
  `rol` varchar(20) NOT NULL DEFAULT 'ganadero',
  `codigo_admin` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `password`, `cedula`, `celular`, `licose`, `nombre`, `apellido`, `tipo_usuario`, `correo`, `rol`, `codigo_admin`) VALUES
(12, 'cawenandy@gmail.com', '$2y$10$AB.FnY6EzhmdMf2URSmcreeFBsa.6Wkjdfnvc2vgygWlPewRBLQX6', '59198391', '081873187', 'ad883u8d83d8', 'andy', 'cawen', 'ganadero', NULL, 'ganadero', NULL),
(13, 'cawenaandy@gmail.com', '$2y$10$wc5FLblUjzHHm6I5YYvvlOR0VwDWoosYLCr.CSlMYa.UxQirijNVe', '57199812', '098318738', 'lijdnj12u38u', 'andyy', 'cawen', 'ganadero', NULL, 'ganadero', NULL),
(14, 'cawe13naandy@gmail.com', '$2y$10$jsyz1wav9vp88FZF/mXwM.nS.QVV0nTsZD5c6xmH1knaEm0TzURj.', '57199812', '098318738', 'lijdnj12u38u', 'andyy', 'cawen', 'ganadero', NULL, 'ganadero', NULL),
(15, 'baldo12', '$2y$10$i25Vzroxc7BLHgYGZ1fuCO80J/1wLNiiCz0CZsfe4boI9qJR/E0HO', '57199812', '098318738', 'lijdnj12u38u', 'andyy', 'cawen', 'ganadero', NULL, 'ganadero', NULL),
(16, NULL, '$2y$10$3JiaTOLeGO0Opy6.5QPRvei3BSM72g4GHpCi3fyM5fNfNEVR1Ashm', '93434093', '039403904', '9430ek3d9k39', 'alberto', 'perez', 'ganadero', 'juan@gmail.com', 'ganadero', NULL),
(17, NULL, '$2y$10$0Lx280teT1/MPGjsGQOR1OgUBU5psCQuJgB54yDSgMBJK09NrTCFa', '57393939', '098123821', 'L1sjd38jd838', 'juan', 'perez', 'ganadero', 'correo@gmail.com', 'ganadero', NULL),
(18, NULL, '$2y$10$ob2pN308myctCjCacG4f.Ob24SJZlsxoS4gw8zUVHkOJYd415AcZC', '01930139', '019301930', '23jn3jn1j23n', 'andyy', 'saul', 'administrador', 'admin@gmail.com', 'administrador', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `animales`
--
ALTER TABLE `animales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_animal` (`id_animal`),
  ADD KEY `fk_usuario_animal` (`usuario_id`);

--
-- Indices de la tabla `auditoria_admin`
--
ALTER TABLE `auditoria_admin`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `historial_animales`
--
ALTER TABLE `historial_animales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `animales`
--
ALTER TABLE `animales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `auditoria_admin`
--
ALTER TABLE `auditoria_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `historial_animales`
--
ALTER TABLE `historial_animales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `animales`
--
ALTER TABLE `animales`
  ADD CONSTRAINT `fk_usuario_animal` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
