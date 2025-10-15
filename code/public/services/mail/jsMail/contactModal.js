function openContactModal(contact = null) {
    const isEditing = contact !== null;
    const modalHTML = `
        <div class="modal-overlay" id="contact-modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${isEditing ? 'Modifier le contact' : 'Nouveau Contact'}</h2>
                    <span class="close-button" id="close-contact-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="contact-form">
                        <div class="form-group">
                            <label for="contact-name">Nom (Désignation) <span class="required">*</span></label>
                            <input type="text" id="contact-name" required value="${contact ? contact.name : ''}">
                        </div>
                        <div class="form-group">
                            <label for="contact-description">Description</label>
                            <textarea id="contact-description" rows="3">${contact ? contact.description : ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Type de contact</label>
                            <select id="contact-category">
                                <option value="particulier" ${contact && contact.category === 'particulier' ? 'selected' : ''}>Particulier</option>
                                <option value="entreprise" ${contact && contact.category === 'entreprise' ? 'selected' : ''}>Entreprise</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Détails du contact <span class="required">*</span></label>
                            <div id="contact-details-container">
                                <!-- Les champs email/téléphone seront ajoutés ici -->
                            </div>
                            <button type="button" id="add-contact-detail-btn" class="btn-add-field">+ Ajouter un email/téléphone</button>
                        </div>

                        <div class="form-group">
                            <label>Informations supplémentaires</label>
                            <div id="custom-fields-container">
                                <!-- Les champs personnalisés seront ajoutés ici -->
                            </div>
                            <button type="button" id="add-custom-field-btn" class="btn-add-field">+ Ajouter une information</button>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" id="cancel-contact-modal">Annuler</button>
                    <button class="btn-primary" id="save-contact-btn">${isEditing ? 'Sauvegarder' : 'Créer le contact'}</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalOverlay = document.getElementById('contact-modal-overlay');
    const form = document.getElementById('contact-form');

    // --- Gestion dynamique des champs ---

    const detailsContainer = document.getElementById('contact-details-container');
    const addDetailBtn = document.getElementById('add-contact-detail-btn');

    const addDetailField = (type = 'email', value = '') => {
        const fieldId = `detail-${Date.now()}`;
        const detailHTML = `
            <div class="dynamic-field" id="${fieldId}">
                <select class="detail-type">
                    <option value="email" ${type === 'email' ? 'selected' : ''}>Email</option>
                    <option value="phone" ${type === 'phone' ? 'selected' : ''}>Téléphone</option>
                </select>
                <input type="text" class="detail-value" placeholder="${type === 'email' ? 'exemple@domaine.com' : '771234567'}" value="${value}" required>
                <button type="button" class="btn-remove-field" data-target="${fieldId}">&times;</button>
            </div>
        `;
        detailsContainer.insertAdjacentHTML('beforeend', detailHTML);
    };

    addDetailBtn.addEventListener('click', () => addDetailField());
    addDetailField(); // Ajouter un premier champ par défaut

    const customFieldsContainer = document.getElementById('custom-fields-container');
    const addCustomFieldBtn = document.getElementById('add-custom-field-btn');

    const addCustomField = (key = '', value = '') => {
        const fieldId = `custom-${Date.now()}`;
        const customFieldHTML = `
            <div class="dynamic-field" id="${fieldId}">
                <input type="text" class="custom-field-key" placeholder="Nom du champ (ex: Métier)" value="${key}">
                <input type="text" class="custom-field-value" placeholder="Valeur" value="${value}">
                <button type="button" class="btn-remove-field" data-target="${fieldId}">&times;</button>
            </div>
        `;
        customFieldsContainer.insertAdjacentHTML('beforeend', customFieldHTML);
    };

    addCustomFieldBtn.addEventListener('click', () => addCustomField());

    // Délégué d'événement pour supprimer des champs
    modalOverlay.addEventListener('click', e => {
        if (e.target.classList.contains('btn-remove-field')) {
            document.getElementById(e.target.dataset.target)?.remove();
        }
    });

    // --- Gestion de la modale et de la soumission ---

    const closeModal = () => modalOverlay.remove();
    document.getElementById('close-contact-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-contact-modal').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) closeModal();
    });

    document.getElementById('save-contact-btn').addEventListener('click', async () => {
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Récupérer les détails de contact
        const details = Array.from(detailsContainer.querySelectorAll('.dynamic-field')).map(field => ({
            type: field.querySelector('.detail-type').value,
            value: field.querySelector('.detail-value').value
        })).filter(d => d.value.trim() !== '');

        if (details.length === 0) {
            alert("Veuillez renseigner au moins un email ou un numéro de téléphone.");
            return;
        }

        // Récupérer les champs personnalisés
        const customFields = Array.from(customFieldsContainer.querySelectorAll('.dynamic-field')).map(field => ({
            key: field.querySelector('.custom-field-key').value,
            value: field.querySelector('.custom-field-value').value
        })).filter(cf => cf.key.trim() !== '' && cf.value.trim() !== '');

        const contactData = {
            name: document.getElementById('contact-name').value,
            description: document.getElementById('contact-description').value,
            category: document.getElementById('contact-category').value,
            details,
            customFields
        };

        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            alert('Contact ajouté avec succès !');
            closeModal();
            // Ici, il faudrait appeler une fonction pour rafraîchir la liste des contacts
            if (typeof renderContacts === 'function') {
                // Simule un rechargement pour l'instant
                location.reload();
            }
        } catch (error) {
            alert(`Erreur: ${error.message}`);
        }
    });
}