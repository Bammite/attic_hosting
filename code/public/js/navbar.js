// Fichier: js/navbar.js (version améliorée)

document.addEventListener('DOMContentLoaded', () => {
    // --- Sélection des éléments du DOM ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContentWrapper = document.querySelector('.nav-content-wrapper');
    const dropdownItems = document.querySelectorAll('.nav-item-with-dropdown');
    
    // Éléments pour le méga menu (bureau)
    const megaMenu = document.querySelector('.dropdown-mega-menu');
    const megaMenuContentContainer = megaMenu.querySelector('.dropdown-content-container');
    
    // Éléments pour la navigation mobile
    const subNavPanel = document.querySelector('.sub-nav-panel');
    const mobileBackButton = subNavPanel.querySelector('.mobile-back-button');
    const mobileNavTitle = subNavPanel.querySelector('#mobile-nav-title');
    const subNavContent = subNavPanel.querySelector('.sub-nav-content');

    let activeDropdown = null;

    // --- Gestion du menu hamburger (mobile) ---
    mobileMenuBtn.addEventListener('click', () => {
        const isActive = navContentWrapper.classList.toggle('active');
        mobileMenuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        
        // Si on ferme le menu principal, on s'assure de fermer aussi le sous-menu
        if (!isActive) {
            navContentWrapper.classList.remove('submenu-active');
        }
    });

    // --- Gestion des clics sur les items avec dropdown ---
    dropdownItems.forEach(item => {
        const link = item.querySelector('a'); // Le lien cliquable
        const menuKey = item.dataset.menu;
        const panel = document.getElementById(`${menuKey}-menu`);

        link.addEventListener('click', (e) => {
            e.preventDefault();

            if (window.innerWidth > 992) {
                handleDesktopDropdown(item, panel);
            } else {
                handleMobileSubmenu(item, panel);
            }
        });
    });
    
    // --- Logique pour le Méga Menu (Bureau) ---
    function handleDesktopDropdown(clickedItem, panel) {
        if (clickedItem.isSameNode(activeDropdown)) {
            closeAllDropdowns();
            return;
        }
        closeAllDropdowns();

        clickedItem.classList.add('active');
        megaMenuContentContainer.innerHTML = panel.innerHTML;
        megaMenu.classList.add('active');
        activeDropdown = clickedItem;
    }

    function closeAllDropdowns() {
        if (activeDropdown) activeDropdown.classList.remove('active');
        megaMenu.classList.remove('active');
        activeDropdown = null;
    }
    
    // Fermer le dropdown si on clique en dehors
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 992 && activeDropdown) {
            const isClickInsideNav = e.target.closest('.glass-nav');
            if (!isClickInsideNav) {
                closeAllDropdowns();
            }
        }
    });

    // --- Logique pour les Sous-Menus coulissants (Mobile) ---
    function handleMobileSubmenu(item, panel) {
        const titleText = item.querySelector('a').innerText;
        mobileNavTitle.textContent = titleText;
        subNavContent.innerHTML = panel.innerHTML; // On peuple le panneau
        navContentWrapper.classList.add('submenu-active'); // On fait coulisser
    }

    mobileBackButton.addEventListener('click', () => {
        navContentWrapper.classList.remove('submenu-active'); // On revient en arrière
    });
    
    // --- Gestion du redimensionnement de la fenêtre ---
    window.addEventListener('resize', () => {
        closeAllDropdowns();
        if (window.innerWidth > 992) {
            navContentWrapper.classList.remove('active', 'submenu-active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});