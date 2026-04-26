// Espera a que el contenido de la página cargue
document.addEventListener('DOMContentLoaded', () => {

    // 🔐 DETECTAR USUARIO (NUEVO, NO ROMPE NADA)
    const usuario = obtenerUsuario();

    if (usuario) {
        console.log("Bienvenido", usuario.usuario);
    } else {
        console.log("Estás como invitado");
    }

    // --- Efecto de feedback para el botón "Saber más" ---
    const btnLearn = document.getElementById('btn-learn');
    if (btnLearn) {
        btnLearn.addEventListener('click', () => {
            alert("¡Bienvenido a la nueva era de AgroAlerta!");
        });
    }

    // --- Efecto de pulsación para las tarjetas de Explorar ---
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        // Cuando presionas el mouse
        card.addEventListener('mousedown', () => {
            card.style.transform = "scale(0.95) translateY(-5px)";
        });

        // Cuando sueltas el mouse
        card.addEventListener('mouseup', () => {
            card.style.transform = "scale(1.02) translateY(-12px)";
        });

        // Por si sacas el mouse de la tarjeta mientras presionas
        card.addEventListener('mouseleave', () => {
            card.style.transform = "translateY(0)";
        });
    });
});