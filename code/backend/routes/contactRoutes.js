const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Middleware pour simuler un utilisateur authentifié (à remplacer par votre vrai middleware JWT)
const fakeAuth = (req, res, next) => {
    req.user = { id: 1 }; // Simule l'utilisateur avec l'ID 1
    next();
};

// Route pour créer un nouveau contact
router.post('/', fakeAuth, contactController.createContact);

// Route pour récupérer tous les contacts
router.get('/', fakeAuth, contactController.getContacts);

module.exports = router;