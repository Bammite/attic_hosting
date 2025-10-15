document.addEventListener('DOMContentLoaded', () => {
    const servicesData = [
        {
            type: 'Hébergement Mutualisé',
            icon: 'mdi:server',
            plan: 'Premium',
            collaborators: 2,
            items: [
                { name: 'mon-super-site.sn', type: 'Site Web' },
                { name: 'blog.mon-super-site.sn', type: 'Site Web' },
                { name: 'contact@mon-super-site.sn', type: 'Email' }
            ]
        },
        {
            type: 'Serveur VPS',
            icon: 'mdi:harddisk',
            plan: 'VPS Pro',
            collaborators: 5,
            items: [
                { name: 'API Bammite', type: 'Application' },
                { name: 'Serveur de test', type: 'Application' }
            ]
        },
        {
            type: 'Hébergement Mutualisé',
            icon: 'mdi:server',
            plan: 'Essentiel',
            collaborators: 2,
            items: [
                { name: 'portfolio-client.com', type: 'Site Web' },
            ]
        },
        {
            type: 'Hébergement Mutualisé',
            icon: 'mdi:server',
            plan: 'Essentiel',
            collaborators: 2,
            items: [
                { name: 'portfolio-client.com', type: 'Site Web' },
            ]
        }
    ];

    const container = document.querySelector('.services-overview-container');
    if (!container) return;

    // Vider le conteneur avant d'ajouter les nouveaux éléments
    container.innerHTML = '';

    if (servicesData.length === 0) {
        container.innerHTML = '<p>Vous n\'avez aucun service actif pour le moment.</p>';
        return;
    }

    servicesData.forEach(service => {
        const serviceBlock = document.createElement('div');
        serviceBlock.className = 'service-block';

        // Créer la liste des éléments de service (sites, emails, etc.)
        const itemsHTML = service.items.map(item => `
            <div class="service-item">
                <span class="service-item-name">${item.name}</span>
                <span class="service-item-type">${item.type}</span>
            </div>
        `).join('');

        // NOUVEAU: Créer le pied de page pour les collaborateurs s'il y en a
        const collaboratorsFooter = service.collaborators > 0
            ? `
            <div class="service-block-footer">
                <iconify-icon icon="mdi:account-group-outline" width="20"></iconify-icon>
                <span>${service.collaborators} collaborateur${service.collaborators > 1 ? 's' : ''}</span>
            </div>`
            : '';

        serviceBlock.innerHTML = `
            <div class="service-block-header">
                <div class="service-block-title">
                    <iconify-icon icon="${service.icon}" width="28"></iconify-icon>
                    <div>
                        <h3>${service.type}</h3>
                        <span>Plan: ${service.plan}</span>
                    </div>
                </div>
                <div class="service-block-menu">
                    <button class="menu-toggle-btn">
                        <iconify-icon icon="mdi:dots-vertical" width="24"></iconify-icon>
                    </button>
                    <div class="menu-options">
                        <a href="#">Détails</a>
                        <a href="#">Gérer</a>
                        <a href="#">Paramètres</a>
                    </div>
                </div>
            </div>
            <div class="service-block-content">
                ${itemsHTML}
            </div>
            ${collaboratorsFooter}
        `;

        container.appendChild(serviceBlock);
    });

    /**
     * Amélioration de la gestion des événements de clic pour les menus contextuels.
     * On utilise un seul écouteur sur `document` (délégation d'événements)
     * pour gérer à la fois l'ouverture et la fermeture des menus.
     * C'est plus performant que d'avoir plusieurs écouteurs.
     */
    document.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('.menu-toggle-btn');
        const activeMenus = document.querySelectorAll('.menu-options.active');

        // Si on a cliqué sur un bouton de menu
        if (menuBtn) {
            const currentMenu = menuBtn.nextElementSibling;
            
            // Ferme tous les autres menus
            activeMenus.forEach(menu => {
                if (menu !== currentMenu) {
                    menu.classList.remove('active');
                }
            });
            // Ouvre ou ferme le menu actuel
            currentMenu.classList.toggle('active');
        } else if (!e.target.closest('.menu-options')) { // Si on a cliqué en dehors de tout menu ouvert
            activeMenus.forEach(menu => menu.classList.remove('active'));
        }
    });
});
