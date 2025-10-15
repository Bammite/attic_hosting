
// --- Script pour la fonctionnalité "Tout cocher" ---

document.addEventListener('DOMContentLoaded', () => {
    // Pour la vue mobile
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            // On sélectionne les checkboxes au moment du clic, pas au chargement de la page.
            const contactCheckboxes = document.querySelectorAll('.contact-checkbox');
            contactCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // Pour la vue desktop
    const selectAllCheckboxDesktop = document.getElementById('selectAllCheckboxDesktop');
    if (selectAllCheckboxDesktop) {
        selectAllCheckboxDesktop.addEventListener('change', function() {
            // On sélectionne les checkboxes au moment du clic.
            const contactCheckboxesDesktop = document.querySelectorAll('.contact-checkbox-desktop');
            contactCheckboxesDesktop.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
});