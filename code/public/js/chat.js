// chat.js - Gestion de l'interface de chat IA

document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesContainer = document.getElementById('messages-container');
    const newChatBtn = document.getElementById('new-chat-btn');
    const conversationsContainer = document.getElementById('conversations-container');
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettings = document.getElementById('close-settings');
    const settingsModal = document.getElementById('settings-modal');
    const clearHistoryBtn = document.getElementById('clear-history');
    const attachmentBtn = document.getElementById('attachment-btn');
    const fileUpload = document.getElementById('file-upload');
    const chatStatus = document.getElementById('chat-status');
    
    // Variables d'état
    let currentConversationId = null;
    let conversations = JSON.parse(localStorage.getItem('sanarois-chat-conversations')) || [];
    let isTyping = false;
    
    // Initialisation
    initChat();
    
    // Écouteurs d'événements
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    newChatBtn.addEventListener('click', startNewConversation);
    settingsBtn.addEventListener('click', openSettings);
    closeSettings.addEventListener('click', closeSettingsModal);
    clearHistoryBtn.addEventListener('click', clearConversationHistory);
    attachmentBtn.addEventListener('click', triggerFileUpload);
    fileUpload.addEventListener('change', handleFileUpload);
    
    // Fermer le modal si on clique en dehors
    settingsModal.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            closeSettingsModal();
        }
    });
    
    // Fonctions
    
    /**
     * Initialise le chat - charge la dernière conversation ou en crée une nouvelle
     */
    function initChat() {
        if (conversations.length > 0) {
            // Charger la dernière conversation
            currentConversationId = conversations[0].id;
            loadConversation(currentConversationId);
        } else {
            // Créer une nouvelle conversation
            startNewConversation();
        }
        
        // Remplir la liste des conversations
        renderConversationsList();
    }
    
    /**
     * Crée une nouvelle conversation
     */
    function startNewConversation() {
        const newConversation = {
            id: Date.now().toString(),
            title: 'Nouvelle conversation',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        currentConversationId = newConversation.id;
        conversations.unshift(newConversation);
        saveConversations();
        
        // Effacer l'affichage des messages
        messagesContainer.innerHTML = '';
        
        // Ajouter le message d'accueil
        addAIMessage("Bonjour ! Je suis l'assistant IA de Sanarois. Comment puis-je vous aider aujourd'hui ?");
        
        // Mettre à jour la liste des conversations
        renderConversationsList();
    }
    
    /**
     * Charge une conversation existante
     * @param {string} conversationId - ID de la conversation à charger
     */
    function loadConversation(conversationId) {
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) return;
        
        currentConversationId = conversationId;
        
        // Effacer l'affichage des messages
        messagesContainer.innerHTML = '';
        
        // Charger les messages de la conversation
        conversation.messages.forEach(msg => {
            if (msg.sender === 'user') {
                addUserMessage(msg.content);
            } else {
                addAIMessage(msg.content);
            }
        });
        
        // Faire défiler vers le bas
        scrollToBottom();
        
        // Mettre à jour la liste des conversations (pour marquer la conversation active)
        renderConversationsList();
    }
    
    /**
     * Envoie un message de l'utilisateur
     */
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Ajouter le message de l'utilisateur à l'interface
        addUserMessage(message);
        
        // Sauvegarder le message dans la conversation actuelle
        const conversation = conversations.find(c => c.id === currentConversationId);
        if (conversation) {
            conversation.messages.push({
                sender: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });
            
            // Mettre à jour le titre si c'est le premier message
            if (conversation.messages.length === 1) {
                conversation.title = message.length > 30 ? message.substring(0, 30) + '...' : message;
            }
            
            conversation.updatedAt = new Date().toISOString();
            saveConversations();
            renderConversationsList();
        }
        
        // Effacer le champ de saisie
        messageInput.value = '';
        adjustTextareaHeight();
        
        // Simuler une réponse de l'IA
        simulateAIResponse(message);
    }
    
    /**
     * Simule une réponse de l'IA (dans un vrai système, ce serait un appel API)
     * @param {string} userMessage - Message de l'utilisateur
     */
    function simulateAIResponse(userMessage) {
        // Afficher l'indicateur de frappe
        showTypingIndicator();
        
        // Simuler un délai de traitement
        setTimeout(() => {
            // Cacher l'indicateur de frappe
            hideTypingIndicator();
            
            // Générer une réponse basique (dans un vrai système, ce serait la réponse de l'IA)
            let aiResponse = generateAIResponse(userMessage);
            
            // Ajouter la réponse de l'IA
            addAIMessage(aiResponse);
            
            // Sauvegarder la réponse dans la conversation
            const conversation = conversations.find(c => c.id === currentConversationId);
            if (conversation) {
                conversation.messages.push({
                    sender: 'ai',
                    content: aiResponse,
                    timestamp: new Date().toISOString()
                });
                conversation.updatedAt = new Date().toISOString();
                saveConversations();
            }
        }, 1500 + Math.random() * 2000); // Délai aléatoire entre 1.5 et 3.5 secondes
    }
    
    /**
     * Génère une réponse simulée de l'IA
     * @param {string} userMessage - Message de l'utilisateur
     * @returns {string} Réponse simulée de l'IA
     */
    function generateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Réponses prédéfinies en fonction du message de l'utilisateur
        if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut')) {
            return "Bonjour ! Comment puis-je vous aider avec votre projet Sanarois aujourd'hui ?";
        } else if (lowerMessage.includes('service') || lowerMessage.includes('créer')) {
            return "Pour créer un nouveau service sur Sanarois, vous pouvez soumettre votre code via le tableau de bord ou décrire votre idée et notre équipe vous aidera à la concrétiser. Voulez-vous que je vous guide étape par étape ?";
        } else if (lowerMessage.includes('documentation') || lowerMessage.includes('aide')) {
            return "Nous avons une documentation complète disponible dans la section 'Documentation & Ressources'. Je peux vous fournir des liens spécifiques si vous me dites sur quel sujet vous avez besoin d'aide.";
        } else if (lowerMessage.includes('merci')) {
            return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions. Je suis là pour vous aider à réussir votre projet.";
        } else if (lowerMessage.includes('code') || lowerMessage.includes('programmation')) {
            return "Si vous avez besoin d'aide avec du code, vous pouvez me montrer votre code et je ferai de mon mieux pour vous aider à le corriger ou l'améliorer. Vous pouvez également utiliser notre outil d'analyse de code pour des suggestions automatiques.";
        } else {
            // Réponse par défaut si aucun mot-clé n'est reconnu
            const defaultResponses = [
                "Je comprends votre demande. Pouvez-vous me donner plus de détails pour que je puisse vous aider au mieux ?",
                "C'est une excellente question. Pour vous répondre précisément, j'aurais besoin de quelques précisions supplémentaires.",
                "Je peux certainement vous aider avec cela. Notre plateforme offre plusieurs fonctionnalités qui pourraient vous être utiles.",
                "Merci pour votre message. Je vais faire de mon mieux pour vous fournir les informations dont vous avez besoin."
            ];
            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
    }
    
    /**
     * Affiche l'indicateur de frappe de l'IA
     */
    function showTypingIndicator() {
        if (isTyping) return;
        
        isTyping = true;
        updateStatus('typing');
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message ai-message typing-indicator-container';
        typingIndicator.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span>IA en train d'écrire</span>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingIndicator);
        scrollToBottom();
    }
    
    /**
     * Cache l'indicateur de frappe de l'IA
     */
    function hideTypingIndicator() {
        isTyping = false;
        updateStatus('online');
        
        const typingIndicator = document.querySelector('.typing-indicator-container');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    /**
     * Met à jour le statut de l'IA dans l'interface
     * @param {string} status - Statut à afficher (online/typing/offline)
     */
    function updateStatus(status) {
        if (!chatStatus) return; // Ajouter cette vérification
        
        const statusDot = chatStatus.querySelector('.status-dot');
        const statusText = chatStatus.querySelector('span');
        
        if (statusDot) {
            statusDot.className = 'status-dot ' + status;
        }
        
        if (statusText) {
            switch(status) {
                case 'online':
                    statusText.textContent = 'IA en ligne';
                    break;
                case 'typing':
                    statusText.textContent = 'IA en train d\'écrire...';
                    break;
                case 'offline':
                    statusText.textContent = 'IA hors ligne';
                    break;
            }
        }
    }
    
    /**
     * Ajoute un message utilisateur à l'interface
     * @param {string} message - Contenu du message
     */
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">
                    <p>${marked.parse(message)}</p>
                </div>
                <div class="message-time">
                    <span>${formatTime(new Date())}</span>
                </div>
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }
    
    /**
     * Ajoute un message IA à l'interface
     * @param {string} message - Contenu du message
     */
    function addAIMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message ai-message';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">
                    <p>${marked.parse(message)}</p>
                </div>
                <div class="message-time">
                    <span>${formatTime(new Date())}</span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }
    
    /**
     * Fait défiler le conteneur des messages vers le bas
     */
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    /**
     * Ajuste la hauteur du textarea en fonction du contenu
     */
    function adjustTextareaHeight() {
        messageInput.style.height = 'auto';
        messageInput.style.height = (messageInput.scrollHeight) + 'px';
    }
    
    /**
     * Formate une date pour l'affichage
     * @param {Date} date - Date à formater
     * @returns {string} Date formatée
     */
    function formatTime(date) {
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // Moins d'une minute
            return 'À l\'instant';
        } else if (diff < 3600000) { // Moins d'une heure
            const minutes = Math.floor(diff / 60000);
            return `Il y a ${minutes} min`;
        } else if (diff < 86400000) { // Moins d'un jour
            const hours = Math.floor(diff / 3600000);
            return `Il y a ${hours} h`;
        } else if (isToday(date)) { // Aujourd'hui
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (isYesterday(date)) { // Hier
            return 'Hier ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString(); // Date complète pour les dates plus anciennes
        }
    }

    /**
     * Vérifie si une date est aujourd'hui
     * @param {Date} date - Date à vérifier
     * @returns {boolean}
     */
    function isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    /**
     * Vérifie si une date est hier
     * @param {Date} date - Date à vérifier
     * @returns {boolean}
     */
    function isYesterday(date) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();
    }

    /**
     * Sauvegarde les conversations dans le localStorage
     */
    function saveConversations() {
        localStorage.setItem('sanarois-chat-conversations', JSON.stringify(conversations));
    }

    /**
     * Affiche la liste des conversations dans le sidebar
     */
    function renderConversationsList() {
        const container = document.getElementById('conversations-container');
        container.innerHTML = '';

        conversations.forEach(conv => {
            const item = document.createElement('div');
            item.className = 'conversation-item';
            if (conv.id === currentConversationId) {
                item.className += ' active';
            }
            item.textContent = conv.title;
            item.onclick = () => loadConversation(conv.id);
            container.appendChild(item);
        });
    }

    /**
     * Ouvre le modal des paramètres
     */
    function openSettings() {
        settingsModal.classList.add('active');
    }

    /**
     * Ferme le modal des paramètres
     */
    function closeSettingsModal() {
        settingsModal.classList.remove('active');
    }

    /**
     * Efface l'historique des conversations
     */
    function clearConversationHistory() {
        if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique des conversations ?')) {
            conversations = [];
            saveConversations();
            startNewConversation();
            closeSettingsModal();
        }
    }

    /**
     * Déclenche l'upload de fichier
     */
    function triggerFileUpload() {
        fileUpload.click();
    }

    /**
     * Gère l'upload de fichier
     * @param {Event} e - Événement de changement de fichier
     */
    function handleFileUpload(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const filesInfo = files.map(file => `${file.name} (${formatFileSize(file.size)})`).join('\n');
        messageInput.value += `\nFichiers joints:\n${filesInfo}`;
        adjustTextareaHeight();

        // Reset l'input file pour permettre de sélectionner le même fichier
        fileUpload.value = '';
    }

    /**
     * Formate la taille d'un fichier en unités lisibles
     * @param {number} bytes - Taille en octets
     * @returns {string} Taille formatée
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Ajout des écouteurs d'événements pour le textarea
    messageInput.addEventListener('input', adjustTextareaHeight);
});