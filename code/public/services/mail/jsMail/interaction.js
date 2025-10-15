        document.addEventListener('DOMContentLoaded', () => {

            // Gestion du sélecteur de compte
            const accountSelectorToggle = document.getElementById('account-selector-toggle');
            const accountDropdown = document.getElementById('account-dropdown');
            const selectedAccountName = document.getElementById('selected-account-name');
            if (accountSelectorToggle && accountDropdown) {
                accountSelectorToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    accountDropdown.classList.toggle('active');
                });

                document.querySelectorAll('.account-option').forEach(option => {
                    option.addEventListener('click', (e) => {
                        e.preventDefault();
                        selectedAccountName.textContent = e.target.textContent;
                        accountDropdown.classList.remove('active');
                        // Ici, vous ajouteriez la logique pour filtrer les interactions par compte
                    });
                });
            }

            // Gestion de la modale de filtre
            const filterModal = document.getElementById('filter-modal');
            const openFilterModalBtn = document.getElementById('open-filter-modal');
            const closeFilterModalBtn = document.getElementById('close-filter-modal');
            if (filterModal && openFilterModalBtn && closeFilterModalBtn) {
                openFilterModalBtn.addEventListener('click', () => filterModal.style.display = 'flex');
                closeFilterModalBtn.addEventListener('click', () => filterModal.style.display = 'none');
                filterModal.addEventListener('click', (e) => {
                    if (e.target === filterModal) filterModal.style.display = 'none';
                });
            }

            // Fermer les menus déroulants si on clique ailleurs
            document.addEventListener('click', (e) => {
                if (optionsMenu && !optionsMenu.contains(e.target)) optionsMenu.classList.remove('active');
                if (optionsToggle && !optionsToggle.contains(e.target)) optionsToggle.classList.remove('active');
                if (accountDropdown && !accountDropdown.contains(e.target) && e.target !== accountSelectorToggle && !accountSelectorToggle.contains(e.target)) {
                    accountDropdown.classList.remove('active');
                }
            });
        });