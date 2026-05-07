
document.addEventListener('DOMContentLoaded', () => {

    
    const usuario = obtenerUsuario();

    if (usuario) {
        console.log("Bienvenido", usuario.usuario);
    } else {
        console.log("Estás como invitado");
    }

    
    const btnLearn = document.getElementById('btn-learn');
    if (btnLearn) {
        btnLearn.addEventListener('click', () => {
            alert("¡Bienvenido a la nueva era de AgroAlerta!");
        });
    }

    
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        
        card.addEventListener('mousedown', () => {
            card.style.transform = "scale(0.95) translateY(-5px)";
        });

        
        card.addEventListener('mouseup', () => {
            card.style.transform = "scale(1.02) translateY(-12px)";
        });

        
        card.addEventListener('mouseleave', () => {
            card.style.transform = "translateY(0)";
        });
    });
});