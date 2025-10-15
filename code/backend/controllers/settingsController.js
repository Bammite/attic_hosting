const { pool } = require('../config/db');
const { encrypt } = require('../utils/crypto');

/**
 * Récupère la liste des expéditeurs configurés pour un utilisateur.
 */
const getEmailSenders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // On ne sélectionne jamais le mot de passe, même chiffré.
        const [senders] = await pool.query(
            'SELECT id, email_address, provider_name, is_default FROM email_senders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json(senders);
    } catch (error) {
        next(error);
    }
};

/**
 * Ajoute une nouvelle configuration d'expéditeur.
 */
const addEmailSender = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { email_address, provider_name, smtp_host, smtp_port, smtp_user, smtp_pass, smtp_secure } = req.body;

        if (!email_address || !provider_name || !smtp_host || !smtp_port || !smtp_user || !smtp_pass) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        const smtp_pass_encrypted = encrypt(smtp_pass);

        const [result] = await pool.query(
            'INSERT INTO email_senders (user_id, email_address, provider_name, smtp_host, smtp_port, smtp_user, smtp_pass_encrypted, smtp_secure) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, email_address, provider_name, smtp_host, smtp_port, smtp_user, smtp_pass_encrypted, !!smtp_secure]
        );

        res.status(201).json({ message: 'Expéditeur ajouté avec succès', senderId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Cette adresse email est déjà configurée.' });
        }
        next(error);
    }
};

/**
 * Supprime une configuration d'expéditeur.
 */
const deleteEmailSender = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const [result] = await pool.query('DELETE FROM email_senders WHERE id = ? AND user_id = ?', [id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Configuration d'expéditeur non trouvée ou non autorisée." });
        }

        res.status(200).json({ message: 'Expéditeur supprimé avec succès.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getEmailSenders, addEmailSender, deleteEmailSender };