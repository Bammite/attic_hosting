document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('support-search');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            console.log('Recherche en cours pour:', query);
            // Ici, vous pourrez ajouter la logique pour filtrer les articles d'aide
        });
    }
}); 