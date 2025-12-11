const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

/**
 * Middleware pour protéger les routes.
 * Vérifie le token JWT et attache l'utilisateur à la requête.
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Récupérer le token de l'en-tête "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // 2. Vérifier et décoder le token
            const jwtSecret = process.env.JWT_SECRET || 'un-secret-tres-long-et-difficile-a-deviner';
            const decoded = jwt.verify(token, jwtSecret);

            // 3. Récupérer l'utilisateur depuis la base de données (sans le mot de passe)
            // et l'attacher à l'objet `req` pour qu'il soit disponible dans les contrôleurs
            const [users] = await pool.query('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.id]);

            if (users.length === 0) {
                res.status(401);
                return next(new Error('Non autorisé, utilisateur non trouvé.'));
            }
            req.user = users[0];

            next(); // Passe à la prochaine étape (le contrôleur)
        } catch (error) {
            res.status(401);
            return next(new Error('Non autorisé, le token a échoué.'));
        }
    }

    if (!token) {
        res.status(401);
        return next(new Error('Non autorisé, aucun token fourni.'));
    }
};

module.exports = { protect };