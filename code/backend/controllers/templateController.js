const { pool } = require('../config/db');

/**
 * Crée un nouveau template d'email et l'enregistre dans la base de données.
 */
const createTemplate = async (req, res, next) => {
    try {
        // L'ID de l'utilisateur sera récupéré via le middleware d'authentification
        const userId = req.user.id; 
        const { name, subject, body } = req.body;

        // Validation simple des données
        if (!name || !subject || !body) {
            return res.status(400).json({ message: "Le nom, le sujet et le corps du template sont requis." });
        }

        const [result] = await pool.query(
            'INSERT INTO email_templates (user_id, name, subject, body_html) VALUES (?, ?, ?, ?)',
            [userId, name, subject, body]
        );

        res.status(201).json({ message: 'Template créé avec succès', templateId: result.insertId });
    } catch (error) {
        next(error); // Transmet l'erreur au gestionnaire d'erreurs global
    }
};

module.exports = { createTemplate };