document.addEventListener('DOMContentLoaded', () => {
    const senderListContainer = document.getElementById('sender-list');
    const addSenderForm = document.getElementById('add-sender-form');
    const API_URL = '/api/settings/email-senders';

    /**
     * Affiche une notification simple.
     */
    const notify = (message, isError = false) => {
        alert(message);
        if (isError) console.error(message);
    };

    /**
     * Récupère et affiche la liste des expéditeurs.
     */
    const fetchSenders = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Impossible de charger les expéditeurs.');
            }
            const senders = await response.json();
            renderSenders(senders);
        } catch (error) {
            notify(error.message, true);
            senderListContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
        }
    };

    /**
     * Affiche les expéditeurs dans la liste.
     */
    const renderSenders = (senders) => {
        senderListContainer.innerHTML = '';
        if (senders.length === 0) {
            senderListContainer.innerHTML = '<p>Aucun expéditeur configuré pour le moment.</p>';
            return;
        }

        senders.forEach(sender => {
            const senderItem = document.createElement('div');
            senderItem.className = 'sender-item';
            senderItem.innerHTML = `
                <div class="sender-info">
                    <span class="sender-name">${sender.provider_name}</span>
                    <span class="sender-email">${sender.email_address}</span>
                </div>
                <div class="sender-actions">
                    ${sender.is_default ? '<span class="default-badge">Défaut</span>' : ''}
                    <button class="btn-delete" data-id="${sender.id}" title="Supprimer">&#128465;</button>
                </div>
            `;
            senderListContainer.appendChild(senderItem);
        });
    }; 

    /**
     * Gère la soumission du formulaire d'ajout.
     */
    addSenderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email_address').value;

        // Pré-remplir les données pour Gmail
        const gmailData = {
            smtp_host: 'smtp.gmail.com',
            smtp_port: 465,
            smtp_secure: true,
            smtp_user: email, // Pour Gmail, l'utilisateur SMTP est l'adresse email complète
        };

        const formData = {
            ...gmailData,
            provider_name: document.getElementById('provider_name').value,
            email_address: email,
            smtp_pass: document.getElementById('smtp_pass').value,
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            notify('Expéditeur ajouté avec succès !');
            addSenderForm.reset();
            fetchSenders(); // Rafraîchir la liste
        } catch (error) {
            notify(error.message, true);
        }
    });

    /**
     * Gère la suppression d'un expéditeur.
     */
    senderListContainer.addEventListener('click', async (e) => {
        if (e.target.closest('.btn-delete')) {
            const senderId = e.target.closest('.btn-delete').dataset.id;
            if (confirm(`Voulez-vous vraiment supprimer cet expéditeur ?`)) {
                try {
                    const response = await fetch(`${API_URL}/${senderId}`, { method: 'DELETE' });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.message);

                    notify('Expéditeur supprimé avec succès !');
                    fetchSenders(); // Rafraîchir la liste
                } catch (error) {
                    notify(error.message, true);
                }
            }
        }
    });

    // Chargement initial
    fetchSenders();
});