document.addEventListener('DOMContentLoaded', () => {
    const optionsToggle = document.getElementById('options-toggle');
    const optionsMenu = document.getElementById('options-menu');

    if (optionsToggle && optionsMenu) {
        optionsToggle.addEventListener('click', (event) => {
            // Empêche la propagation pour que le clic sur le document ne se déclenche pas immédiatement
            event.stopPropagation(); 
            optionsMenu.classList.toggle('active');
            optionsToggle.classList.toggle('active');
        });

        // Ferme le menu si on clique n'importe où ailleurs sur la page
        document.addEventListener('click', (event) => {
            if (!optionsMenu.contains(event.target)) {
                optionsMenu.classList.remove('active');
                optionsToggle.classList.remove('active');
            }
        });
    }
});