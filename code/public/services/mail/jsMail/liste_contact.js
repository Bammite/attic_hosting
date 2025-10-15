document.addEventListener('DOMContentLoaded', () => {

    // --- Collection de contacts (données de test) ---
    let contactsData = [
        { id: 'd3hi9s', name: 'Cabinet Ahmed BA', email: 'ahmed@gamil.co', phone: '784371193', description: 'Client provenant de...', date: '31/08/26', interactions: 5, category: 'entreprise', companyName: 'Cabinet Ahmed BA' },
        { id: 'a6fe5d', name: 'Yoro Fall', email: 'yoro@fall.co', phone: '771234567', description: 'Partenaire commercial', date: '15/07/26', interactions: 12, category: 'particulier', companyName: null },
        { id: 'b8gh2k', name: 'Mohamed Cheikh', email: 'mohamed@cheikh.com', phone: '765432100', description: 'Prospect qualifié', date: '10/06/26', interactions: 2, category: 'particulier', companyName: null },
        { id: 'c1ij4m', name: 'Awa Gueye', email: 'awa@gueye.sn', phone: '701122334', description: 'Contact interne', date: '01/05/26', interactions: 25, category: 'entreprise', companyName: 'Solutions Pro' }
    ];

    // --- Génération dynamique de la liste des contacts ---
    const mobileListContainer = document.getElementById('contact-list-mobile');
    const desktopListContainer = document.getElementById('contact-list-desktop');
    const loaderContainer = document.getElementById('loader-container');

    function renderContacts(data) {
        // Vide les conteneurs
        mobileListContainer.innerHTML = '';
        desktopListContainer.innerHTML = '';

        data.forEach(contact => {
            // Génère la vue mobile
            const mobileItem = `
                <li class="contact-list-item" data-id="${contact.id}" data-email="${contact.email}" data-phone="${contact.phone}">
                    <div class="contact-info-mobile">
                        <input type="checkbox" class="contact-checkbox">
                        <span>${contact.name}</span>
                    </div>
                    <div class="contact-action-mobile">&#9654;</div>
                </li>`;
            mobileListContainer.innerHTML += mobileItem;

            // Génère la vue desktop
            const desktopItem = `
                <tr data-id="${contact.id}" data-email="${contact.email}" data-phone="${contact.phone}">
                    <td><input type="checkbox" id="contact-checkbox-${contact.id}" name="contact-checkbox" value="${contact.id}" class="contact-checkbox-desktop"></td>
                    <td>${contact.id}</td>
                    <td>${contact.name}</td>
                    <td class="contact-info-desktop">
                        <span class="email">${contact.emails[0]? contact.emails[0] : ''}</span>
                        <span class="phone">${contact.phones[0] ? contact.phones[0] : ''}</span>
                    </td>
                    <td class="contact-info-desktop">${contact.description}</td>
                    <td>${contact.created_at}</td>
                    <td>${contact.interactions}</td>
                    <td class="contact-actions-desktop">
                        <span>&#9998;</span> <span>&#9993;</span> <span>&#128172;</span>
                    </td>
                </tr>`;
            desktopListContainer.innerHTML += desktopItem;
        });
    }

    // Charge les contacts depuis le serveur
    async function loadContacts() {
        showLoader(loaderContainer);
        mobileListContainer.innerHTML = '';
        desktopListContainer.innerHTML = '';

        try {
            const response = await fetch('/api/contacts');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des contacts.');
            }
            contactsData = await response.json(); // Met à jour la variable globale
            renderContacts(contactsData);
        } catch (error) {
            console.error(error);
            desktopListContainer.innerHTML = `<tr><td colspan="8" style="text-align: center; color: red; padding: 2rem;">${error.message}</td></tr>`;
        } finally {
            hideLoader(loaderContainer);
        }
    }    
    
    // Lancement du chargement au démarrage de la page
    loadContacts();


    // --- Actions de groupe ---

    // Fonction pour récupérer les données des contacts sélectionnés
    function getSelectedContactsData() {
        const selectedContactIds = new Set();
        // Sélectionne toutes les cases cochées (mobile et desktop)
        const checkedBoxes = document.querySelectorAll('.contact-checkbox:checked, .contact-checkbox-desktop:checked');
        
        checkedBoxes.forEach(checkbox => {
            const contactRow = checkbox.closest('li, tr'); // Trouve le parent <li> ou <tr>
            if (contactRow && contactRow.dataset.id) {
                selectedContactIds.add(contactRow.dataset.id);
            }
        });
        console.log('Contacts Data:', contactsData);
        console.log('Selected Contact IDs:', selectedContactIds);


        // Retourne les objets contacts complets
        return Array.from(selectedContactIds).map(id => contactsData.find(c => c.id == id)).filter(Boolean);
    }

    if (document.getElementById('bulk-action-send-mail')) {
        document.getElementById('bulk-action-send-mail').addEventListener('click', () => {
            const selectedContacts = getSelectedContactsData();
            // On passe les objets contacts complets au compositeur
            openComposer({ type: 'email', recipients: selectedContacts });
        });
    }
    
    if (document.getElementById('bulk-action-send-sms')) {
        document.getElementById('bulk-action-send-sms').addEventListener('click', () => {
            const { phones } = getSelectedContactsData();
            openComposer({ type: 'sms', recipients: phones });
        });
    }
});
