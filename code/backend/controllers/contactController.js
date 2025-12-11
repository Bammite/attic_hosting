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

/**
 * Supprime un contact appartenant à l'utilisateur authentifié.
 */
const deleteContact = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params; // L'ID du contact à supprimer

        const [result] = await pool.query(
            'DELETE FROM contacts WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        // Si aucune ligne n'a été affectée, le contact n'existe pas ou n'appartient pas à l'utilisateur.
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Contact non trouvé ou non autorisé." });
        }

        res.status(200).json({ message: 'Contact supprimé avec succès.' });
    } catch (error) {
        next(error);
    }
};

/**
 * Met à jour un contact existant.
 */
const updateContact = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        const userId = req.user.id;
        const { id } = req.params; // L'ID du contact à modifier
        const { name, description, category, details, customFields } = req.body;

        // Validation
        if (!name || !details || details.length === 0) {
            return res.status(400).json({ message: "Le nom et au moins un détail de contact sont requis." });
        }

        await connection.beginTransaction();

        // 1. Vérifier que le contact appartient bien à l'utilisateur
        const [contactCheck] = await connection.query('SELECT id FROM contacts WHERE id = ? AND user_id = ?', [id, userId]);
        if (contactCheck.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Contact non trouvé ou non autorisé." });
        }

        // 2. Mettre à jour les informations principales du contact
        await connection.query(
            'UPDATE contacts SET name = ?, description = ?, category = ? WHERE id = ?',
            [name, description, category, id]
        );

        // 3. Remplacer les anciens détails par les nouveaux (plus simple que de comparer)
        await connection.query('DELETE FROM contact_details WHERE contact_id = ?', [id]);
        if (details && details.length > 0) {
            const detailsValues = details.map(d => [id, d.type, d.value]);
            await connection.query('INSERT INTO contact_details (contact_id, type, value) VALUES ?', [detailsValues]);
        }

        // 4. Remplacer les anciens champs personnalisés
        await connection.query('DELETE FROM contact_custom_fields WHERE contact_id = ?', [id]);
        if (customFields && customFields.length > 0) {
            const customFieldsValues = customFields.map(cf => [id, cf.key, cf.value]);
            await connection.query('INSERT INTO contact_custom_fields (contact_id, field_key, field_value) VALUES ?', [customFieldsValues]);
        }

        await connection.commit();

        res.status(200).json({ message: 'Contact mis à jour avec succès' });

    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};


module.exports = { createContact, getContacts, deleteContact, updateContact };