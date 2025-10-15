const { pool } = require('../config/db');

/**
 * Crée un nouveau contact avec ses détails et champs personnalisés.
 */
const createContact = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        const userId = req.user.id; 
        const { name, description, category, details, customFields } = req.body;

        // Validation
        if (!name || !details || details.length === 0) {
            return res.status(400).json({ message: "Le nom et au moins un détail de contact (email/téléphone) sont requis." });
        }

        await connection.beginTransaction();

        // 1. Insérer le contact principal
        const [contactResult] = await connection.query(
            'INSERT INTO contacts (user_id, name, description, category) VALUES (?, ?, ?, ?)',
            [userId, name, description, category || 'particulier']
        );
        const contactId = contactResult.insertId;

        // 2. Insérer les détails de contact (emails/téléphones)
        if (details && details.length > 0) {
            const detailsValues = details.map(d => [contactId, d.type, d.value]);
            await connection.query('INSERT INTO contact_details (contact_id, type, value) VALUES ?', [detailsValues]);
        }

        // 3. Insérer les champs personnalisés
        if (customFields && customFields.length > 0) {
            const customFieldsValues = customFields.map(cf => [contactId, cf.key, cf.value]);
            await connection.query('INSERT INTO contact_custom_fields (contact_id, field_key, field_value) VALUES ?', [customFieldsValues]);
        }

        await connection.commit();

        res.status(201).json({ message: 'Contact créé avec succès', contactId });

    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};

/**
 * Récupère tous les contacts d'un utilisateur avec leurs détails.
 */
const getContacts = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Cette requête complexe utilise des sous-requêtes pour agréger les emails et téléphones
        // de chaque contact en une seule ligne, ce qui est très efficace.
        const [contacts] = await pool.query(`
            SELECT 
                c.id,
                c.name,
                c.description,
                c.category,
                c.created_at,
                (SELECT GROUP_CONCAT(cd.value) FROM contact_details cd WHERE cd.contact_id = c.id AND cd.type = 'email') as emails,
                (SELECT GROUP_CONCAT(cd.value) FROM contact_details cd WHERE cd.contact_id = c.id AND cd.type = 'phone') as phones
            FROM contacts c
            WHERE c.user_id = ?
            ORDER BY c.name ASC
        `, [userId]);

        // Transforme les chaînes "email1,email2" en tableaux ['email1', 'email2']
        const processedContacts = contacts.map(contact => ({
            ...contact,
            emails: contact.emails ? contact.emails.split(',') : [],
            phones: contact.phones ? contact.phones.split(',') : [],
        }));

        res.json(processedContacts);
    } catch (error) {
        next(error);
    }
};


module.exports = { createContact, getContacts };