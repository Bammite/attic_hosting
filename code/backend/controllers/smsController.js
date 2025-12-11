const { senderBasiqueSMS } = require('../services/orangeSms');

/**
 * Contrôleur pour gérer l'envoi de SMS via une requête API.
 * @param {import('express').Request} req - L'objet de la requête Express.
 * @param {import('express').Response} res - L'objet de la réponse Express.
 * @param {import('express').NextFunction} next - La fonction middleware suivante.
 */
const sendSmsController = async (req, res, next) => {
    // On récupère le message et le numéro depuis le corps de la requête POST
    const { message, numDestinataire } = req.body;

    // --- Validation des entrées ---
    if (!message || !numDestinataire) {
        // On définit le statut de l'erreur
        res.status(400); // Bad Request
        // On passe une nouvelle erreur à notre gestionnaire d'erreurs global (errorHandler)
        return next(new Error("Le 'message' et le 'numDestinataire' sont requis dans le corps de la requête."));
    }

    // On récupère l'ID de l'utilisateur depuis le middleware d'authentification
    const userId = req.user.id;

    try {
        console.log(`Tentative d'envoi de SMS par l'utilisateur ${userId} à ${numDestinataire}`);
        const apiResponse = await senderBasiqueSMS(userId, message, numDestinataire);

        // La réponse de l'API Orange peut contenir des informations utiles
        // même en cas de succès partiel. On la renvoie au client.
        res.status(200).json({
            success: true,
            message: "La requête d'envoi de SMS a été soumise avec succès.",
            apiResponse: apiResponse
        });

    } catch (error) {
        // Si senderBasiqueSMS lève une exception (ex: identifiants incorrects, API Orange indisponible),
        // on la passe à notre gestionnaire d'erreurs.
        console.error("Erreur interceptée dans le contrôleur SMS:", error.message);
        // Le gestionnaire d'erreurs (errorHandler.js) se chargera de formater et d'envoyer la réponse d'erreur.
        next(error);
    }
};

module.exports = {
    sendSmsController,
};
