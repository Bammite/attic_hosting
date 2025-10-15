const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// Middleware pour simuler un utilisateur authentifié (à remplacer par votre vrai middleware JWT)
const fakeAuth = (req, res, next) => {
    req.user = { id: 1, role: 'admin' }; // Simule l'utilisateur avec l'ID 1
    next();
};

// Protéger toutes les routes de ce fichier
router.use(fakeAuth);

router.get('/email-senders', settingsController.getEmailSenders);
router.post('/email-senders', settingsController.addEmailSender);
router.delete('/email-senders/:id', settingsController.deleteEmailSender);

module.exports = router;