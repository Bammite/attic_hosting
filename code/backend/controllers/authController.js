const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Génère un token JWT pour un utilisateur.
 * @param {number} id - L'ID de l'utilisateur.
 * @returns {string} Le token JWT.
 */
const generateToken = (id) => {
    // Le secret JWT devrait être dans une variable d'environnement pour la sécurité
    const jwtSecret = process.env.JWT_SECRET || 'un-secret-tres-long-et-difficile-a-deviner';
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: '30d', // Le token expirera dans 30 jours
    });
};

/**
 * Inscription d'un nouvel utilisateur.
 */
const registerUser = async (req, res, next) => {
    try {
        const { username, email, password, isDeveloper, isStudent } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Le nom d'utilisateur, l'email et le mot de passe sont requis." });
        }

        // Vérifier si l'utilisateur existe déjà
        const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Un utilisateur avec cet email ou nom d'utilisateur existe déjà." });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insérer le nouvel utilisateur
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash, developpeur, etudiant) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, isDeveloper === 'true', isStudent === 'true']
        );

        const newUserId = result.insertId;

        res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            token: generateToken(newUserId),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Connexion d'un utilisateur existant.
 */
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "L'email et le mot de passe sont requis." });
        }

        // Trouver l'utilisateur par email
        const [users] = await pool.query('SELECT id, password_hash FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." }); // Message générique pour la sécurité
        }

        const user = users[0];

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        res.status(200).json({
            message: 'Connexion réussie.',
            token: generateToken(user.id),
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser };