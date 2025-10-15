const nodemailer = require('nodemailer');
const { pool } = require('../config/db');
const { decrypt } = require('../utils/crypto');

/**
 * Envoie un email en utilisant une configuration d'expéditeur stockée.
 */
const sendEmail = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { senderId, recipients, subject, body } = req.body;

        if (!senderId || !recipients || recipients.length === 0 || !subject || !body) {
            return res.status(400).json({ message: "Les informations d'envoi sont incomplètes." });
        }

        // 1. Récupérer les informations de l'expéditeur depuis la base de données
        const [senders] = await pool.query(
            'SELECT * FROM email_senders WHERE id = ? AND user_id = ?',
            [senderId, userId]
        );

        if (senders.length === 0) {
            return res.status(404).json({ message: "Configuration d'expéditeur non trouvée ou non autorisée." });
        }

        const senderConfig = senders[0];

        // 2. Déchiffrer le mot de passe SMTP
        const smtpPassword = decrypt(senderConfig.smtp_pass_encrypted);

        // 3. Créer un transporteur Nodemailer
        const transporter = nodemailer.createTransport({
            host: senderConfig.smtp_host,
            port: senderConfig.smtp_port,
            secure: senderConfig.smtp_secure, // true for 465, false for other ports
            auth: {
                user: senderConfig.smtp_user,
                pass: smtpPassword,
            },
        });

        // 4. Envoyer l'email
        const info = await transporter.sendMail({
            from: `"${senderConfig.provider_name}" <${senderConfig.email_address}>`,
            to: recipients.join(', '), // Liste des destinataires séparés par des virgules
            subject: subject,
            html: body,
        });

        console.log('Message envoyé: %s', info.messageId);
        res.status(200).json({ message: 'Email envoyé avec succès !', info });

    } catch (error) {
        next(error); // Transmet l'erreur au gestionnaire global
    }
};

module.exports = { sendEmail };