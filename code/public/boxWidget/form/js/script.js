document.addEventListener('DOMContentLoaded', () => {

    // Collection de données initiale pour les formulaires
    const formsData = [
        {
            id: 'form-01',
            title: 'Enquête de satisfaction client 2024',
            status: 'Ouvert',
            responseCount: 128,
            shareLink: 'https://bammite.com/forms/f/xyz123'
        },
        {
            id: 'form-02',
            title: 'Inscription au webinar Tech',
            status: 'Fermé',
            responseCount: 50,
            shareLink: 'https://bammite.com/forms/f/abc987'
        },
        {
            id: 'form-03',
            title: 'Sondage interne sur le télétravail',
            status: 'Ouvert',
            responseCount: 32,
            shareLink: 'https://bammite.com/forms/f/def456'
        }
    ];

    // --- Logique pour le bouton de création de formulaire ---
    const createNewFormBtn = document.getElementById('create-new-form-btn');
    if (createNewFormBtn) {
        createNewFormBtn.addEventListener('click', () => {
            window.location.href = 'createformulaire.html';
        });
    }

    const formListContainer = document.getElementById('form-list-container');
    const template = document.getElementById('form-item-template');

    if (!formListContainer || !template) return;

    // Fonction pour afficher les formulaires
    function renderForms() {
        formListContainer.innerHTML = ''; // Vider la liste

        formsData.forEach(form => {
            const clone = template.content.cloneNode(true);
            const formItem = clone.querySelector('.form-item');
            
            formItem.dataset.id = form.id;
            clone.querySelector('.form-title').textContent = form.title;
            clone.querySelector('.form-responses').textContent = form.responseCount;
            
            const statusBadge = clone.querySelector('.status-badge');
            statusBadge.textContent = form.status;
            statusBadge.classList.add(form.status === 'Ouvert' ? 'open' : 'closed');

            const toggleStatusAction = clone.querySelector('.action-toggle-status');
            toggleStatusAction.textContent = form.status === 'Ouvert' ? 'Fermer les soumissions' : 'Ouvrir les soumissions';

            clone.querySelector('.copy-link-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(form.shareLink).then(() => {
                    alert(`Lien copié : ${form.shareLink}`);
                });
            });

            formListContainer.appendChild(clone);
        });
    }

    renderForms();

    // --- Gestion des menus contextuels (délégation d'événements) ---
    document.body.addEventListener('click', (e) => {
        const clickedItemMenuBtn = e.target.closest('.item-menu-btn');
        const clickedHeaderMenuBtn = e.target.closest('#header-menu-btn');
        
        // Fermer tous les menus actifs
        const activeMenus = document.querySelectorAll('.menu-options.active');
        let clickedMenu = null;

        if (clickedItemMenuBtn) {
            clickedMenu = clickedItemMenuBtn.nextElementSibling;
        } else if (clickedHeaderMenuBtn) {
            clickedMenu = clickedHeaderMenuBtn.nextElementSibling;
        }

        activeMenus.forEach(menu => {
            if (menu !== clickedMenu) {
                menu.classList.remove('active');
            }
        });

        // Si on a cliqué sur un bouton de menu, on bascule son état
        if (clickedMenu) {
            clickedMenu.classList.toggle('active');
        }

        // Logique pour les actions dans les menus (exemple)
        const actionDelete = e.target.closest('.action-delete');
        if (actionDelete) {
            const formItem = actionDelete.closest('.form-item');
            if (confirm(`Voulez-vous vraiment supprimer le formulaire "${formItem.querySelector('.form-title').textContent}" ?`)) {
                // Ici, vous ajouteriez la logique pour supprimer les données
                console.log(`Suppression du formulaire ID: ${formItem.dataset.id}`);
                formItem.remove();
            }
        }
    });

    // --- Logique pour la recherche de formulaires ---
    const searchInput = document.getElementById('form-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const formItems = document.querySelectorAll('.form-item');

            formItems.forEach(item => {
                const title = item.querySelector('.form-title').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    item.style.display = 'grid'; // 'grid' pour correspondre au style initial
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});









