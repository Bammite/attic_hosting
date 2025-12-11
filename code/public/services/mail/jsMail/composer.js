/* --- Fonctions utilitaires pour les cookies --- */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // encodeURIComponent est utilisé pour s'assurer que la valeur du cookie est bien formatée.
    document.cookie = name + "=" + (encodeURIComponent(value) || "")  + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length,c.length));
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999; path=/';  
}

/**
 * Pour l'utiliser :
 * 1. Inclure composer.css et composer.js dans votre page HTML.
 * 2. Appeler la fonction `openComposer({ type: 'email' | 'sms', recipients: ['destinataire1', 'destinataire2'] })`
 */

/**
 * Valide une adresse email avec une expression régulière simple.
 * @param {string} email L'adresse email à valider.
 * @returns {boolean} True si l'email est valide, sinon false.
 */
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function openComposer(options = {}) {
    // Options par défaut
    const { 
        type = 'email',
        mode = 'send', // 'send', 'create-template', 'edit-template', 'use-template'
        recipients = [],
        ignoreDraft = false, // Nouvelle option pour ignorer l'ébauche
        template = {} // { name: '', subject: '', body: '' }
    } = options;

    console.log(
        'recipients:', recipients,
        'ignoreDraft:', ignoreDraft,
        'template:', template
    )

    // --- 1. Création de la structure HTML ---
    // On utilise une variable d'état pour le mode, qui peut être modifiée dynamiquement.
    let currentMode = mode;

    const composerOverlay = document.createElement('div');
    composerOverlay.className = 'composer-overlay';

    const isEmail = type === 'email';
    const title = isEmail ? 'Nouveau message' : 'Nouveau SMS';

    // Champ pour le nom du template, conditionnel
    const templateNameField = `
        <div class="composer-field" id="composer-template-name-container" style="display: ${currentMode === 'create-template' || currentMode === 'edit-template' ? 'flex' : 'none'};">
             <label for="composer-template-name">Nom Template</label>
             <input type="text" id="composer-template-name" placeholder="Ex: Relance facture N°1">
        </div>`;

    // Définir le texte du bouton principal
    let actionButtonText = 'Envoyer';
    if (currentMode === 'create-template') {
        actionButtonText = 'Sauvegarder';
    } else if (currentMode === 'edit-template') {
        actionButtonText = 'Modifier';
    }



    const senderOptions = isEmail ? `<select id="composer-sender"><option>Chargement...</option></select>` : `<span>+33 6 12 34 56 78 (par défaut)</span>`;

    const subjectField = isEmail
        ? `<div class="composer-field">
             <label for="composer-subject">Objet</label>
             <input type="text" id="composer-subject" placeholder="Sujet de votre message">
           </div>`
        : '';

    composerOverlay.innerHTML = `
        <div class="composer-container">
            <header class="composer-header">
                <h2>${title}</h2>
                <button class="composer-close-btn">&times;</button>
            </header>
            <div class="composer-body">
                <div class="composer-field">
                    <label for="composer-sender">Expéditeur</label>
                    ${senderOptions}
                </div>
                <div class="composer-field composer-recipients-field">
                    <label>À</label>
                    <div class="recipients-container">
                        <input type="text" id="composer-recipients-input" placeholder="Ajouter un destinataire">
                    </div>
                    <button class="contact-picker-btn">Contacts</button>
                </div>
                ${templateNameField}
                ${subjectField}
                <div class="composer-editor-container">
                    <div class="composer-toolbar"> 
                        <button data-command="bold"><b>B</b></button>
                        <button data-command="italic"><i>I</i></button>
                        <button data-command="underline"><u>U</u></button>
                        <button data-command="insertUnorderedList" title="Liste à puces">●</button>
                        <button data-command="insertOrderedList" title="Liste numérotée">1.</button>
                        <button data-command="ai-assist" title="Assistance IA">AI✨</button>
                    </div>
                    <div class="composer-editor" contenteditable="true"></div>
                </div>
            </div>
            <footer class="composer-footer">
                <div class="composer-actions">
                    <!-- Actions visibles sur grand écran -->
                    <div class="composer-desktop-actions">
                        <button title="Joindre un fichier" class="composer-action-btn">&#128206;</button>
                        <button title="Sauvegarder comme template" id="composer-save-as-template-btn" class="composer-action-btn">&#128190;</button>
                        <button title="Effacer la rédaction" id="composer-clear-btn" class="composer-action-btn composer-danger-btn">&#128465;</button>
                    </div>
                    <!-- Menu pour petit écran -->
                    <div class="composer-mobile-more-options">
                        <button id="composer-more-options-toggle" class="composer-action-btn">&#8942;</button>
                        <div id="composer-more-options-menu" class="composer-more-options-menu">
                            <a href="#" id="mobile-action-attach">Joindre un fichier</a>
                            <a href="#" id="mobile-action-save-template">Sauvegarder comme template</a>
                            <a href="advanced_editor.html" target="_blank" id="mobile-action-advanced">Options avancées</a>
                            <a href="#" id="mobile-action-clear" class="danger-text">Effacer la rédaction</a>
                        </div>
                    </div>
                </div>
                <div class="composer-main-actions">
                    <a href="advanced_editor.html" target="_blank" class="composer-advanced-btn">Options avancées</a>
                    <button class="composer-send-btn">${actionButtonText}</button>
                </div>
            </footer>
        </div>

        <!-- Modale d'assistance IA -->
        <div id="composer-ai-modal" class="composer-ai-modal">
            <div class="composer-ai-content">
                <div class="composer-ai-header">
                    <h3>Assistant de rédaction IA</h3>
                    <button id="composer-ai-close" class="composer-close-btn">&times;</button>
                </div>
                <div class="composer-ai-body">
                    <p>Décrivez ce que vous voulez écrire (ex: "un email pour relancer un client pour une facture impayée").</p>
                    <textarea id="composer-ai-prompt" rows="3" placeholder="Votre instruction..."></textarea>
                    <button id="composer-ai-generate-btn" class="btn-primary">Générer</button>
                    <div id="composer-ai-response-container" style="display: none;">
                        <h4>Suggestion de l'IA :</h4>
                        <div id="composer-ai-response" contenteditable="true"></div>
                    </div>
                </div>
                <div class="composer-ai-footer">
                    <button id="composer-ai-insert-btn" class="btn-primary">Insérer dans l'email</button>
                </div>
            </div>
        </div>

        <!-- NOUVEAU : Superposition de notification -->
        <div class="composer-notification-overlay" style="display: none;">
            <div class="composer-notification-content">
                <div class="notification-icon"></div>
                <p class="notification-message"></p>
                <button class="notification-action-btn" style="display: none;"></button>
            </div>
        </div>

    `;

    document.body.appendChild(composerOverlay);

    // --- 2. Ajout de l'interactivité ---

    const closeBtn = composerOverlay.querySelector('.composer-close-btn');
    const sendBtn = composerOverlay.querySelector('.composer-send-btn');
    const editor = composerOverlay.querySelector('.composer-editor');
    const toolbar = composerOverlay.querySelector('.composer-toolbar');
    const senderSelect = composerOverlay.querySelector('#composer-sender');
    const recipientsContainer = composerOverlay.querySelector('.recipients-container');
    const recipientsInput = composerOverlay.querySelector('#composer-recipients-input');
    const templateNameInput = composerOverlay.querySelector('#composer-template-name');
    const advancedBtn = composerOverlay.querySelector('.composer-advanced-btn');
    const saveAsTemplateBtn = composerOverlay.querySelector('#composer-save-as-template-btn');
    const mobileAdvancedBtn = composerOverlay.querySelector('#mobile-action-advanced');
    const clearBtn = composerOverlay.querySelector('#composer-clear-btn');
    const moreOptionsToggle = composerOverlay.querySelector('#composer-more-options-toggle');
    const moreOptionsMenu = composerOverlay.querySelector('#composer-more-options-menu');

    // NOUVEAU : Éléments de la notification
    const notificationOverlay = composerOverlay.querySelector('.composer-notification-overlay');
    const notificationIcon = notificationOverlay.querySelector('.notification-icon');
    const notificationMessage = notificationOverlay.querySelector('.notification-message');
    const notificationActionBtn = notificationOverlay.querySelector('.notification-action-btn');

    // Éléments de la modale IA
    const aiModal = composerOverlay.querySelector('#composer-ai-modal');
    const closeAiModalBtn = composerOverlay.querySelector('#composer-ai-close');
    const generateAiBtn = composerOverlay.querySelector('#composer-ai-generate-btn');
    const aiResponseContainer = composerOverlay.querySelector('#composer-ai-response-container');
    const aiResponseEl = composerOverlay.querySelector('#composer-ai-response');
    const insertAiBtn = composerOverlay.querySelector('#composer-ai-insert-btn');


    let advancedEditorWindow = null; // Référence à la fenêtre de l'éditeur avancé

    // --- NOUVEAU : Gestion des notifications ---
    const showNotification = (state, message) => {
        notificationOverlay.style.display = 'flex';
        notificationIcon.className = 'notification-icon'; // Reset classes
        notificationActionBtn.style.display = 'none';

        if (state === 'sending') {
            notificationIcon.classList.add('sending');
            notificationMessage.textContent = message || 'Envoi en cours...';
        } else if (state === 'success') {
            notificationIcon.classList.add('success');
            notificationMessage.textContent = message || 'Opération réussie !';
            notificationActionBtn.textContent = 'Envoyer un autre message';
            notificationActionBtn.style.display = 'block';
            notificationActionBtn.onclick = () => {
                // Réinitialise le formulaire pour un nouvel envoi
                clearForm(false); // Ne pas demander de confirmation
                notificationOverlay.style.display = 'none';
                sendBtn.disabled = false;
            };
        } else if (state === 'error') {
            notificationIcon.classList.add('error');
            notificationMessage.textContent = message || 'Une erreur est survenue.';
            notificationActionBtn.textContent = 'Réessayer';
            notificationActionBtn.style.display = 'block';
            notificationActionBtn.onclick = () => {
                notificationOverlay.style.display = 'none';
                sendBtn.disabled = false;
            };
        }
    };

    // Fonction pour réinitialiser le formulaire (factorisée depuis clearBtn)
    const clearForm = (confirmFirst = true) => {
        if (confirmFirst && !confirm("Voulez-vous vraiment effacer toute la rédaction ?")) return;
        getPills().forEach(pill => pill.remove());
        if (isEmail) composerOverlay.querySelector('#composer-subject').value = '';
        editor.innerHTML = '';
    };

    // --- NOUVEAU : Chargement des expéditeurs ---
    const loadSenders = async () => {
        if (!isEmail || !senderSelect) return;

        const token = localStorage.getItem('userToken');
        if (!token) {
            console.error("Token non trouvé, impossible de charger les expéditeurs.");
            senderSelect.innerHTML = `<option value="">Erreur: non connecté</option>`;
            return;
        }
      
        try {
            const response = await fetch('/api/settings/email-senders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Erreur au chargement des expéditeurs.');
            
            const senders = await response.json();
            senderSelect.innerHTML = ''; // Vider les options de chargement

            if (senders.length === 0) {
                senderSelect.innerHTML = `<option value="">Aucun expéditeur configuré</option>`;
                senderSelect.disabled = true;
                return;
            }

            senders.forEach(sender => {
                senderSelect.innerHTML += `<option value="${sender.id}">${sender.provider_name} (${sender.email_address})</option>`;
            });
        } catch (error) {
            senderSelect.innerHTML = `<option value="">Erreur de chargement</option>`;
            console.error(error);
        }
    };
    // --- Logique de sauvegarde de l'ébauche ---
    const DRAFT_COOKIE_NAME = 'composerDraft';

    // Fonction pour sauvegarder l'état actuel dans un cookie
    const saveDraft = () => {
        // On ne sauvegarde que si on est en mode 'send'
        if (currentMode !== 'send') return;

        const draftData = {
            recipients: getPills().map(pill => pill.dataset.value),
            subject: isEmail ? composerOverlay.querySelector('#composer-subject').value : '',
            body: editor.innerHTML,
        };

        const draftString = JSON.stringify(draftData);

        // Attention: les cookies ont une taille limitée (environ 4KB).
        if (draftString.length > 3500) {
            console.warn("La taille de l'ébauche est grande, elle pourrait ne pas être sauvegardée correctement dans un cookie.");
        }

        setCookie(DRAFT_COOKIE_NAME, draftString, 1); // Sauvegarde pour 1 jour
    };

    // On utilise un "debounce" pour ne pas sauvegarder à chaque frappe, mais après une pause.
    const debouncedSaveDraft = (() => {
        let timer;
        return () => { clearTimeout(timer); timer = setTimeout(saveDraft, 50); };
    })();

    // Fonction pour fermer le module
    const closeComposer = () => {
        composerOverlay.classList.remove('active');
        // On ne supprime plus le cookie à la fermeture simple.
        window.removeEventListener('storage', handleAdvancedEditorUpdate);
        // Supprimer l'élément du DOM après la transition pour nettoyer
        setTimeout(() => {
            composerOverlay.remove();
        }, 300);
    };

    // Afficher le module avec une animation
    // requestAnimationFrame pour s'assurer que l'élément est dans le DOM avant d'ajouter la classe
    requestAnimationFrame(() => {
        composerOverlay.classList.add('active');
        composerOverlay.addEventListener('input', debouncedSaveDraft); // Sauvegarde sur toute entrée
        window.addEventListener('storage', handleAdvancedEditorUpdate);
    });

    // Événements
    closeBtn.addEventListener('click', closeComposer);
    composerOverlay.addEventListener('click', (e) => {
        if (e.target === composerOverlay) {
            closeComposer();
        }
        // Ferme le menu "plus d'options" si on clique ailleurs
        if (moreOptionsMenu && !moreOptionsMenu.contains(e.target) && e.target !== moreOptionsToggle) {
            moreOptionsMenu.classList.remove('active');
        }
    });

    // Gestion du menu "plus d'options" sur mobile
    moreOptionsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        moreOptionsMenu.classList.toggle('active');
    });

    // Lier les actions du menu mobile aux fonctions existantes
    document.getElementById('mobile-action-save-template').addEventListener('click', (e) => {
        e.preventDefault();
        saveAsTemplateBtn.click();
        moreOptionsMenu.classList.remove('active');
    });

    document.getElementById('mobile-action-clear').addEventListener('click', (e) => {
        e.preventDefault();
        clearBtn.click();
        moreOptionsMenu.classList.remove('active');
    });

    clearBtn.addEventListener('click', () => {
        clearForm(true);
        eraseCookie(DRAFT_COOKIE_NAME);
    });

    saveAsTemplateBtn.addEventListener('click', () => {
        // Change le mode interne en 'create-template'
        currentMode = 'create-template';

        // Affiche le champ pour le nom du template
        const templateNameContainer = document.getElementById('composer-template-name-container');
        templateNameContainer.style.display = 'flex';
        templateNameInput.focus();

        // Met à jour le texte du bouton principal
        sendBtn.textContent = 'Sauvegarder';
    });

    const openAdvancedEditor = (e) => {
        e.preventDefault();

        // 1. Récupérer le contenu actuel de l'éditeur de base
        const subject = isEmail ? composerOverlay.querySelector('#composer-subject').value : '';
        const body = editor.innerHTML;

        // 2. Stocker les données dans sessionStorage
        const dataToPass = {
            subject: subject,
            body: body
        };
        // On utilise JSON.stringify pour stocker l'objet
        sessionStorage.setItem('advancedEditorData', JSON.stringify(dataToPass));

        // 3. Ouvrir l'éditeur avancé dans un nouvel onglet
        if (advancedEditorWindow && !advancedEditorWindow.closed) {
            advancedEditorWindow.focus();
        } else {
            advancedEditorWindow = window.open(advancedBtn.href, '_blank');
        }
    };

    advancedBtn.addEventListener('click', openAdvancedEditor);
    mobileAdvancedBtn.addEventListener('click', openAdvancedEditor);

    // --- Gestion de la communication avec l'éditeur avancé ---
    const handleAdvancedEditorUpdate = (event) => {
        if (event.key === 'advancedEditorUpdate' && event.newValue) {
            const data = JSON.parse(event.newValue);

            // Mettre à jour le sujet
            if (isEmail) {
                composerOverlay.querySelector('#composer-subject').value = data.subject || '';
            }

            // Mettre à jour le corps de l'email dans les deux vues
            editor.innerHTML = data.body || '';

            // Nettoyer le localStorage
            localStorage.removeItem('advancedEditorUpdate');
        }
    };

    // --- Gestion des pilules de destinataires ---

    // Fonction pour récupérer toutes les pilules
    const getPills = () => Array.from(recipientsContainer.querySelectorAll('.recipient-pill'));

    sendBtn.addEventListener('click', () => {
        // Ajouter le dernier destinataire tapé s'il existe
        if (recipientsInput.value.trim()) {
            addPill(recipientsInput.value.trim());
            recipientsInput.value = '';
        }

        // Vérifie s'il y a des pilules invalides avant d'envoyer
        const invalidPills = getPills().filter(pill => pill.classList.contains('invalid'));
        if (isEmail && invalidPills.length > 0) {
            if (!confirm("Certains destinataires ont des adresses invalides. Voulez-vous envoyer le message quand même ?")) {
                return; // Arrête l'envoi
            }
        }

        // S'assurer que le contenu est bien récupéré depuis la vue active
        const finalBody = editor.innerHTML;

        // NOUVEAU : Logique d'envoi personnalisé
        const recipients = getPills().map(pill => pill.dataset.value);
        if (recipients.length > 1 && finalBody.includes('{{')) {
            if (confirm(`Ce message contient des variables de personnalisation. Voulez-vous envoyer un email personnalisé à chacun des ${recipients.length} destinataires ?`)) {
                console.log("Lancement de l'envoi en masse personnalisé...");
                // Ici, vous devriez appeler une fonction backend qui gère la boucle d'envoi.
                // Pour la démo, on affiche juste les données.
                alert(`Simulation d'envoi personnalisé à ${recipients.length} contacts. Voir la console.`);
                console.log({
                    subject: composerOverlay.querySelector('#composer-subject').value,
                    bodyTemplate: finalBody,
                    recipients: recipients
                });
                closeComposer();
                return;
            }
        }

        if (currentMode === 'create-template') {
            // Logique pour sauvegarder/modifier un template
            const templateData = {
                name: templateNameInput.value,
                subject: isEmail ? composerOverlay.querySelector('#composer-subject').value : null,
                body: finalBody
            };

            // --- NOUVELLE LOGIQUE D'APPEL API ---
            fetch('/api/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(templateData),
            })
            .then(response => {
                if (!response.ok) {
                    // Si la réponse n'est pas OK, on lance une erreur pour la catcher plus bas
                    return response.json().then(err => { throw new Error(err.message || 'Erreur serveur') });
                }
                return response.json();
            })
            .then(data => {
                alert('Template sauvegardé avec succès !');
                console.log('Réponse du serveur:', data);
            })
            .catch(error => {
                alert(`Erreur lors de la sauvegarde du template: ${error.message}`);
                console.error('Erreur:', error);
            });
        } else { // 'send' ou 'use-template'
            sendBtn.disabled = true;
            showNotification('sending', 'Envoi en cours...');
            const token = localStorage.getItem('userToken'); // Correction : Utiliser localStorage

            if (isEmail) {
                // Logique pour envoyer un email
                const senderId = senderSelect.value;
                if (!senderId) {
                    alert("Veuillez sélectionner un expéditeur ou en configurer un dans les paramètres.");
                    sendBtn.disabled = false;
                    notificationOverlay.style.display = 'none';
                    return;
                }

                const emailData = {
                    senderId: senderId,
                    recipients: getPills().map(pill => pill.dataset.value),
                    subject: composerOverlay.querySelector('#composer-subject').value,
                    body: finalBody,
                };

                fetch('/api/mailer/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(emailData)
                })
                .then(async response => {
                    const result = await response.json();
                    if (!response.ok) throw result;
                    showNotification('success', "L'email a été envoyé avec succès !");
                    eraseCookie(DRAFT_COOKIE_NAME);
                })
                .catch(error => {
                    const errorMessage = error.message || "Les détails de l'erreur sont dans la console.";
                    showNotification('error', `L'envoi a échoué. ${errorMessage}`);
                    console.error("ERREUR : L'email n'a pas pu être envoyé.", error);
                });
            } else {
                // Logique pour envoyer un SMS
                const recipients = getPills().map(pill => pill.dataset.value);
                const message = editor.innerText; // Pour les SMS, on prend le texte brut

                // On envoie un SMS à chaque destinataire
                const sendPromises = recipients.map(recipient => {
                    return fetch('/api/sms/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ numDestinataire: recipient, message: message })
                    }).then(res => res.ok ? Promise.resolve() : Promise.reject(new Error(`Échec pour ${recipient}`)));
                });

                Promise.all(sendPromises)
                    .then(() => {
                        showNotification('success', 'Tous les SMS ont été soumis à lenvoi !');
                        eraseCookie(DRAFT_COOKIE_NAME);
                    })
                    .catch(error => {
                        showNotification('error', "Au moins un envoi de SMS a échoué. Vérifiez la console.");
                        console.error("Erreur lors de l'envoi des SMS:", error);
                    });
            }
        }
    });

    // Fonction pour ajouter une pilule
    function addPill(recipient) {
        // Gère à la fois les chaînes (emails) et les objets (contacts)
        let value = recipient;
        let display = recipient;

        if (typeof recipient === 'object' && recipient !== null) {
            // Gère le format de l'objet contact { id, name, emails: [...], phones: [...] }
            value = recipient.emails && recipient.emails.length > 0 ? recipient.emails[0] : (recipient.phones && recipient.phones.length > 0 ? recipient.phones[0] : '');
            display = recipient.name || value;
        }

        if (!value || !value.trim()) return;

        const pill = document.createElement('span');
        pill.className = 'recipient-pill';
        pill.dataset.value = value; // On stocke l'email ou le téléphone, pas l'objet entier

        // Valider l'email seulement si le type est 'email'
        if (isEmail && !isValidEmail(value)) {
            pill.classList.add('invalid');
            pill.title = "Adresse email invalide";
        }

        pill.innerHTML = `
            ${display}
            <button class="remove-pill-btn" type="button" title="Supprimer">&times;</button>
        `;
        // Insère la pilule avant le champ de saisie
        recipientsContainer.insertBefore(pill, recipientsInput);
    }

    // Gestion de la saisie dans le champ des destinataires
    recipientsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const recipient = recipientsInput.value.trim();
            if (recipient) {
                addPill(recipient);
                recipientsInput.value = '';
            }
        } else if (e.key === 'Backspace' && recipientsInput.value === '') {
            // Supprimer la dernière pilule si on appuie sur retour arrière dans un champ vide
            const lastPill = getPills().pop();
            if (lastPill) {
                lastPill.remove();
            }
        }
    });

    // Gestion de la suppression d'une pilule via son bouton "x" (délégation d'événement)
    recipientsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-pill-btn')) {
            e.target.closest('.recipient-pill').remove();
        } else {
            recipientsInput.focus(); // Focus sur l'input si on clique dans le conteneur
        }
    });

    // Gestion de la barre d'outils de l'éditeur
    toolbar.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const command = button.dataset.command;
        e.preventDefault();

        if (command === 'ai-assist') {
            openAiModal();
            return;
        }

        if (command) {
            // Les autres commandes ne fonctionnent qu'en mode visuel
            document.execCommand(command, false, null);
            editor.focus();
        }
    });

    // --- Gestion de l'assistance IA ---
    const openAiModal = () => aiModal.classList.add('active');
    const closeAiModal = () => aiModal.classList.remove('active');

    closeAiModalBtn.addEventListener('click', closeAiModal);
    aiModal.addEventListener('click', (e) => {
        if (e.target === aiModal) closeAiModal();
    });

    generateAiBtn.addEventListener('click', () => {
        const prompt = composerOverlay.querySelector('#composer-ai-prompt').value;
        if (!prompt) {
            alert("Veuillez décrire ce que vous voulez écrire.");
            return;
        }
        
        aiResponseEl.innerHTML = "Génération en cours...";
        aiResponseContainer.style.display = 'block';

        // Simulation d'un appel à une API d'IA
        setTimeout(() => {
            const simulatedResponse = `Bonjour [Nom du client],<br><br>Sauf erreur de notre part, il semble que la facture n°[Numéro de facture] d'un montant de [Montant] €, datée du [Date de la facture], n'a pas encore été réglée.<br><br>Pourriez-vous s'il vous plaît vérifier et nous faire un retour ?<br><br>Cordialement,<br>L'équipe Bammite`;
            aiResponseEl.innerHTML = simulatedResponse;
        }, 1500);
    });

    insertAiBtn.addEventListener('click', () => {
        const aiText = aiResponseEl.innerHTML;
        if (aiText && aiText !== "Génération en cours...") {
            editor.focus();
            // Insère le HTML à la position actuelle du curseur
            document.execCommand('insertHTML', false, aiText);
            closeAiModal();
        } else {
            alert("Veuillez d'abord générer une réponse.");
        }
    });


    // --- Logique de restauration de l'ébauche ---
    const savedDraft = getCookie(DRAFT_COOKIE_NAME);
    // On ne restaure que si on est en mode 'send' et qu'on n'ignore pas l'ébauche
    if (currentMode === 'send' && !ignoreDraft && savedDraft) {
        try {
            const draftData = JSON.parse(savedDraft);
            if (draftData.recipients) draftData.recipients.forEach(addPill);
            if (isEmail && draftData.subject) composerOverlay.querySelector('#composer-subject').value = draftData.subject;
            if (draftData.body) editor.innerHTML = draftData.body;
        } catch (e) {
            console.error("Erreur lors de la restauration de l'ébauche:", e);
            eraseCookie(DRAFT_COOKIE_NAME); // Nettoyer le cookie corrompu
        }
    }

    // Pré-remplir les destinataires si fournis
    recipients.forEach(addPill);

    // Pré-remplir les champs pour les modes 'edit' et 'use'
    if (currentMode === 'edit-template') {
        if (templateNameInput) templateNameInput.value = template.name || '';
        if (isEmail) composerOverlay.querySelector('#composer-subject').value = template.subject || '';
        editor.innerHTML = template.body || '';
    }

    if (currentMode === 'use-template') {
        if (isEmail) composerOverlay.querySelector('#composer-subject').value = template.subject || '';
        editor.innerHTML = template.body || '';
    }

    // Charger les expéditeurs au démarrage du compositeur
    loadSenders();

}