const { pool } = require('../config/db');

/**
 * Crée un nouveau formulaire et l'enregistre dans la base de données.
 */
const createForm = async (req, res, next) => {
    try {
        const { title, structure } = req.body;
        const userId = req.user.id; // Récupéré depuis le middleware d'authentification

        if (!title || !structure) {
            return res.status(400).json({ message: "Le titre et la structure du formulaire sont requis." });
        }

        const [result] = await pool.query(
            'INSERT INTO forms (user_id, title, structure) VALUES (?, ?, ?)',
            [userId, title, JSON.stringify(structure)]
        );

        res.status(201).json({ message: 'Formulaire créé avec succès', formId: result.insertId });
    } catch (error) {
        next(error);
    }
};

/**
 * Récupère tous les formulaires pour l'utilisateur authentifié.
 */
const getUserForms = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const [forms] = await pool.query('SELECT id, title, created_at, updated_at FROM forms WHERE user_id = ? ORDER BY updated_at DESC', [userId]);
        res.status(200).json(forms);
    } catch (error) {
        next(error);
    }
};

/**
 * Enregistre la soumission d'une réponse pour un formulaire donné.
 */
const submitFormResponse = async (req, res, next) => {
    try {
        const { id } = req.params; // ID du formulaire
        const responseData = req.body;

        await pool.query(
            'INSERT INTO form_responses (form_id, data) VALUES (?, ?)',
            [id, JSON.stringify(responseData)]
        );

        res.status(201).json({ message: 'Réponse enregistrée avec succès.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createForm,
    getUserForms,
    submitFormResponse,
};