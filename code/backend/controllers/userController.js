/**
 * Récupère les informations du profil de l'utilisateur actuellement connecté.
 * @param {import('express').Request} req - L'objet de la requête Express.
 * @param {import('express').Response} res - L'objet de la réponse Express.
 * @param {import('express').NextFunction} next - La fonction middleware suivante.
 */
const getUserProfile = async (req, res, next) => {
    // Le middleware 'protect' a déjà attaché l'utilisateur à req.user.
    // Il contient les informations que nous avons sélectionnées (id, username, email, role).
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(404);
        return next(new Error("Utilisateur non trouvé."));
    }
};

module.exports = {
    getUserProfile,
};