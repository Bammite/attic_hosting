document.addEventListener('DOMContentLoaded', () => {
    const senderListContainer = document.getElementById('sender-list');
    const token = localStorage.getItem('userToken');
    const providerSelect = document.getElementById('provider-select');
    const providerForms = document.querySelectorAll('.provider-form');

    // Configuration des fournisseurs
    const providersConfig = {
        gmail: { host: 'smtp.gmail.com', port: 465, secure: true },
        yahoo: { host: 'smtp.mail.yahoo.com', port: 465, secure: true }
    };
    const API_URL = '/api/settings/email-senders';

    // Vérifier si l'utilisateur est connecté
    if (!token) {
        alert("Session expirée ou non connecté. Redirection vers la page de connexion.");
        window.location.href = '../../auth.html'; // Ajustez ce chemin si nécessaire
        return;
    }

    /**
     * Affiche une notification simple.
     */ 
    const notify = (message, isError = false) => {
        alert(message);
        if (isError) console.error(message);
    };

    /**
     * Wrapper pour fetch qui ajoute le token d'authentification.
     */
    const apiFetch = async (url, options = {}) => {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        const mergedOptions = { ...defaultOptions, ...options, headers: {...defaultOptions.headers, ...options.headers} };

        const response = await fetch(url, mergedOptions);

        if (response.status === 401) {
            localStorage.removeItem('userToken');
            notify("Votre session a expiré. Veuillez vous reconnecter.", true);
            window.location.href = '../../auth.html';
            throw new Error("Unauthorized");
        }
        return response;
    };

    /**
     * Récupère et affiche la liste des expéditeurs.
     */
    const fetchSenders = async () => {
        try {
            const response = await apiFetch(API_URL);
            if (!response.ok) throw new Error((await response.json()).message || 'Impossible de charger les expéditeurs.');
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
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const provider = form.id.replace('form-', '');
        
        let formData = {};
        const email = form.querySelector('.email_address').value;

        if (provider === 'gmail' || provider === 'yahoo') {
            const config = providersConfig[provider];
            formData = {
                provider_name: form.querySelector('.provider_name').value,
                email_address: email,
                smtp_pass: form.querySelector('.smtp_pass').value,
                smtp_host: config.host,
                smtp_port: config.port,
                smtp_secure: config.secure,
                smtp_user: email, // Pour Gmail et Yahoo, l'utilisateur est l'email
            };
        } else { // "other"
            formData = {
                provider_name: form.querySelector('.provider_name').value,
                email_address: email,
                smtp_host: form.querySelector('.smtp_host').value,
                smtp_port: form.querySelector('.smtp_port').value,
                smtp_user: form.querySelector('.smtp_user').value,
                smtp_pass: form.querySelector('.smtp_pass').value,
                smtp_secure: form.querySelector('.smtp_secure').checked,
            };
        }

        try {
            const response = await apiFetch(API_URL, { method: 'POST', body: JSON.stringify(formData) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            notify('Expéditeur ajouté avec succès !');
            form.reset();
            fetchSenders(); // Rafraîchir la liste
        } catch (error) {
            notify(error.message, true);
        }
    };

    providerForms.forEach(form => form.addEventListener('submit', handleFormSubmit));

    // Gère le changement de fournisseur
    providerSelect.addEventListener('change', () => {
        const selectedProvider = providerSelect.value;
        providerForms.forEach(form => {
            form.classList.toggle('active', form.id === `form-${selectedProvider}`);
        });
    });

    /**
     * Gère la suppression d'un expéditeur.
     */
    senderListContainer.addEventListener('click', async (e) => {
        if (e.target.closest('.btn-delete')) {
            const senderId = e.target.closest('.btn-delete').dataset.id;
            if (confirm(`Voulez-vous vraiment supprimer cet expéditeur ?`)) {
                try {
                    const response = await apiFetch(`${API_URL}/${senderId}`, { method: 'DELETE' });
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