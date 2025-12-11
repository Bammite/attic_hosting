document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('userToken');
    const loader = document.getElementById('loader-container');
    const container = document.querySelector('.container');
    const mobileList = document.getElementById('contact-list-mobile');
    const desktopTbody = document.getElementById('contact-list-desktop');

    // 1. Vérifier si l'utilisateur est connecté

    if (!token) {
        alert("Vous n'êtes pas connecté. Redirection vers la page de connexion.");
        window.location.href = '/auth.html';
        return;
    }

    let allContacts = []; // Stocker tous les contacts pour la modification et la suppression

    const showLoader = () => {
        if (loader) loader.innerHTML = '<div class="loader"></div>';
    };

    const hideLoader = () => {
        if (loader) loader.innerHTML = '';
    };

    const renderContacts = (contacts) => {
        mobileList.innerHTML = '';
        desktopTbody.innerHTML = '';

        if (contacts.length === 0) {
            const emptyMessage = '<li>Aucun contact trouvé.</li>';
            mobileList.innerHTML = emptyMessage;
            desktopTbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Aucun contact trouvé.</td></tr>';
            return;
        }

        contacts.forEach(contact => {
            const formattedDate = new Date(contact.created_at).toLocaleDateString('fr-FR');
            
            // On prend le premier email ou le premier téléphone comme contact principal à afficher
            const mainContactValue = (contact.emails && contact.emails.length > 0) 
                ? contact.emails[0] 
                : (contact.phones && contact.phones.length > 0 ? contact.phones[0] : 'N/A');

               // --- NOUVELLE LOGIQUE D'AFFICHAGE DES CONTACTS ---
            const generateContactDetailsHTML = (contact) => {
                const emails = contact.emails || [];
                const phones = contact.phones || [];
                let html = '';

                if (emails.length > 0) {
                    html += `<div class="contact-detail-line">📧 ${emails[0]}`;
                    if (emails.length > 1) {
                        html += ` <span class="more-count" title="${emails.slice(1).join(', ')}">+${emails.length - 1}</span>`;
                    }
                    html += `</div>`;
                }

                if (phones.length > 0) {
                    html += `<div class="contact-detail-line">📞 ${phones[0]}`;
                    if (phones.length > 1) {
                        html += ` <span class="more-count" title="${phones.slice(1).join(', ')}">+${phones.length - 1}</span>`;
                    }
                    html += `</div>`;
                }

                return html || 'N/A';
            };


            // Ligne pour la table desktop
            const desktopRow = `
                <tr>
                    <td><input type="checkbox" class="contact-checkbox-desktop" data-id="${contact.id}"></td>
                    <td>${contact.id}</td>
                    <td>${contact.name}</td>
                    <td>${generateContactDetailsHTML(contact)}</td>
                    <td>${contact.description || 'N/A'}</td>
                    <td>${formattedDate}</td>
                    <td><button class="btn-icon" title="Voir les interactions">✉️</button></td>
                    <td>
                        <button class="btn-icon btn-edit" data-id="${contact.id}" title="Modifier">✏️</button>
                        <button class="btn-icon btn-delete" data-id="${contact.id}" title="Supprimer">🗑️</button>
                    </td>
                </tr>
            `;
            desktopTbody.innerHTML += desktopRow;

            // Élément pour la liste mobile
            const mobileItem = `
                <li class="contact-item">
                    <div class="contact-info">
                        <input type="checkbox" class="contact-checkbox" data-id="${contact.id}">
                        <div>
                            <span class="contact-name">${contact.name}</span>
                            <span class="contact-value">${mainContactValue}</span>
                        </div>
                    </div>
                    <div class="contact-actions">
                        <button class="btn-icon btn-delete" data-id="${contact.id}" title="Supprimer">🗑️</button>
                    </div>
                </li>
            `;
            mobileList.innerHTML += mobileItem;
        });
    };

    // On rend la fonction globale pour qu'elle soit accessible depuis la modale
    window.fetchContacts = async () => {
        showLoader();
        try {
            // 2. Effectuer l'appel API en incluant le token
            const response = await fetch('/api/contacts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // C'est la ligne la plus importante !
                    'Authorization': `Bearer ${token}`
                }
            });

            // 3. Gérer les cas d'erreur (token expiré, etc.)
            if (response.status === 401) {
                localStorage.removeItem('userToken');
                alert("Votre session a expiré. Veuillez vous reconnecter.");
                window.location.href = '/auth.html';
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur serveur.');
            }

            const contacts = await response.json();
            allContacts = contacts; // On sauvegarde les données complètes
            renderContacts(allContacts);

        } catch (error) {
            console.error('Erreur lors de la récupération des contacts:', error);
            mobileList.innerHTML = `<li>Erreur lors de la récupération des contacts.</li>`;
            desktopTbody.innerHTML = `<tr><td colspan="8" style="text-align: center;">Erreur lors de la récupération des contacts.</td></tr>`;
        } finally {
            hideLoader();
        }
    };

    // Lancer la récupération des contacts au chargement de la page
    window.fetchContacts();

    // Utiliser la délégation d'événements pour les boutons d'action
    container.addEventListener('click', (e) => {
        const editButton = e.target.closest('.btn-edit');
        const deleteButton = e.target.closest('.btn-delete');

        if (editButton) {
            const contactId = parseInt(editButton.dataset.id, 10);
            const contactToEdit = allContacts.find(c => c.id === contactId);
            if (contactToEdit) {
                openContactModal(contactToEdit);
            }
        }

        if (deleteButton) {
            const contactId = deleteButton.dataset.id;
            if (confirm("Voulez-vous vraiment supprimer ce contact ? Cette action est irréversible.")) {
                handleDeleteContact(contactId);
            }
        }
    });

    const handleDeleteContact = async (contactId) => {
        try {
            const response = await fetch(`/api/contacts/${contactId}`, { 
                method: 'DELETE', 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (!response.ok) throw new Error((await response.json()).message || 'Erreur de suppression');
            alert('Contact supprimé avec succès.');
            window.fetchContacts(); // Recharger la liste
        } catch (error) { alert(`Erreur: ${error.message}`); }
    };
});