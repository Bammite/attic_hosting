const express = require('express');
const router = express.Router();
const mailerController = require('../controllers/mailerController');

// Middleware pour simuler un utilisateur authentifié (à remplacer par votre vrai middleware JWT)
const fakeAuth = (req, res, next) => {
    req.user = { id: 1 }; // Simule l'utilisateur avec l'ID 1
    next();
};

// Route pour envoyer un email
router.post('/send', fakeAuth, mailerController.sendEmail);

module.exports = router;