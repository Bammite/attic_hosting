const axios = require('axios');
const { pool } = require('../config/db');

// Les URLs de l'API Orange
const TOKEN_URL = 'https://api.orange.com/oauth/v3/token';
const SMS_URL_TEMPLATE = 'https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B{sender_phone}/requests';

/**
 * Classe pour interagir avec l'API SMS d'Orange.
 */
class OrangeSmsApi {
    constructor(clientId, clientSecret) {
        if (!clientId || !clientSecret) {
            throw new Error("Le Client ID et le Client Secret sont requis.");
        }
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.accessToken = null;
    }

    /**
     * Obtient un token d'accès auprès de l'API Orange.
     * Le token est stocké dans l'instance de la classe.
     * @private
     */
    async #getAccessToken() {
        const authHeader = 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
        const body = 'grant_type=client_credentials';

        try {
            const response = await axios.post(TOKEN_URL, body, {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
            });

            if (response.status !== 200 || !response.data.access_token) {
                throw new Error(`Impossible d’obtenir le token. Statut: ${response.status}. Réponse: ${JSON.stringify(response.data)}`);
            }

            this.accessToken = response.data.access_token;
            console.log("Token d'accès obtenu avec succès.");

        } catch (error) {
            console.error("Erreur lors de l'obtention du token d'accès:", error.response ? error.response.data : error.message);
            // On propage l'erreur pour que l'appelant puisse la gérer
            throw new Error(`Erreur cURL pour obtenir le token : ${error.message}`);
        }
    }

    /**
     * Envoie un SMS.
     *
     * @param {string} senderAddress Le numéro d'envoi autorisé (format international, ex: +22178...).
     * @param {string} receiverAddress Le numéro du destinataire (format international, ex: +22177...).
     * @param {string} message Le contenu du SMS.
     * @param {string|null} [senderName=null] Le nom d'expéditeur à afficher (optionnel).
     * @returns {Promise<object>} La réponse de l'API.
     */
    async sendSms(senderAddress, receiverAddress, message, senderName = null) {
        if (!this.accessToken) {
            await this.#getAccessToken();
        }

        // Enlève le '+' pour l'URL
        const senderPhone = senderAddress.substring(1);
        const smsUrl = SMS_URL_TEMPLATE.replace('{sender_phone}', senderPhone);

        const requestBody = {
            outboundSMSMessageRequest: {
                address: `tel:${receiverAddress}`,
                senderAddress: `tel:${senderAddress}`,
                outboundSMSTextMessage: {
                    message: message,
                },
            },
        };

        if (senderName) {
            requestBody.outboundSMSMessageRequest.senderName = senderName;
        }

        try {
            console.log("Corps de la requête SMS:", JSON.stringify(requestBody, null, 2));
            const response = await axios.post(smsUrl, requestBody, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de l'envoi du SMS:", error.response ? error.response.data : error.message);
            // Si le token a expiré (erreur 401), on pourrait tenter de le renouveler et de réessayer.
            // Pour la simplicité, nous propageons l'erreur ici.
            throw new Error(`L'envoi du SMS a échoué: ${error.message}`);
        }
    }
}

/**
 * Fonction wrapper pour envoyer un SMS via la classe OrangeSmsApi.
 * Charge la configuration depuis les variables d'environnement.
 *
 * @param {number} userId L'ID de l'utilisateur qui effectue l'envoi.
 * @param {string} message Le contenu du SMS.
 * @param {string} numDestinataire Le numéro du destinataire au format international.
 * @returns {Promise<object>} La réponse de l'API Orange en cas de succès.
 */
async function senderBasiqueSMS(userId, message, numDestinataire) {
    // Chargement des variables d'environnement
    require('dotenv').config();

    const { ORANGE_SMS_CLIENT_ID, ORANGE_SMS_CLIENT_SECRET, ORANGE_SMS_SENDER_NUM } = process.env;

    if (!ORANGE_SMS_CLIENT_ID || !ORANGE_SMS_CLIENT_SECRET || !ORANGE_SMS_SENDER_NUM) {
        throw new Error("Les variables d'environnement pour l'API SMS Orange ne sont pas correctement définies.");
    }
    if (!userId || !numDestinataire || !message) {
        throw new Error("Le numéro du destinataire et le message ne peuvent pas être vides.");
    }

    try {
        const senderName = process.env.ORANGE_SMS_SENDER_NAME || null;
        
        const smsClient = new OrangeSmsApi(ORANGE_SMS_CLIENT_ID, ORANGE_SMS_CLIENT_SECRET);
        const response = await smsClient.sendSms(ORANGE_SMS_SENDER_NUM, numDestinataire, message, senderName);

        // --- Journalisation du succès ---
        await pool.query(
            'INSERT INTO communication_logs (user_id, type, recipient, status, error_message) VALUES (?, ?, ?, ?, ?)',
            [userId, 'sms', numDestinataire, 'sent', JSON.stringify(response)]
        );

        return response;
    } catch (error) {
        // --- Journalisation de l'échec ---
        // On s'assure que userId est bien défini avant de tenter d'insérer dans la base.
        if (userId) {
            await pool.query(
                'INSERT INTO communication_logs (user_id, type, recipient, status, error_message) VALUES (?, ?, ?, ?, ?)',
                [userId, 'sms', numDestinataire, 'failed', error.message]
            );
        }
        // On relance l'erreur pour que le contrôleur puisse la traiter.
        throw error;
    }
}

// Exporter la fonction principale pour pouvoir l'utiliser dans d'autres parties de votre application
module.exports = { senderBasiqueSMS, OrangeSmsApi };