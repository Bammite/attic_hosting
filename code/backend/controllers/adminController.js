const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Récupère la liste de tous les utilisateurs (sans leur mot de passe).
 */
const getAllUsers = async (req, res, next) => {
    try {
        const [users] = await pool.query('SELECT id, username, email, role, developpeur, etudiant, creer_par, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

/**
 * Crée un nouvel utilisateur avec un mot de passe hashé.
 */
const createUser = async (req, res, next) => {
    try {
        const { username, email, password, role, developpeur, etudiant } = req.body;
        const creer_par = req.user.id; // L'ID de l'admin qui crée le nouvel utilisateur

        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        // Hashage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash, role, developpeur, etudiant, creer_par) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, role, developpeur || false, etudiant || false, creer_par]
        );

        res.status(201).json({ message: 'Utilisateur créé avec succès', userId: result.insertId });
    } catch (error) {
        // Gérer le cas où l'email existe déjà
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
        }
        next(error);
    }
};

/**
 * Supprime un utilisateur.
 */
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Empêcher un admin de se supprimer lui-même (sécurité)
        if (parseInt(id, 10) === req.user.id) {
            return res.status(403).json({ message: "Vous не pouvez pas supprimer votre propre compte administrateur." });
        }

        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (error) {
        next(error);
    }
};


module.exports = { getAllUsers, createUser, deleteUser };