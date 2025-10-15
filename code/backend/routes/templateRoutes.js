const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

// Middleware simple pour simuler un utilisateur authentifié (à remplacer par un vrai middleware)
const fakeAuth = (req, res, next) => {
    req.user = { id: 1 }; // Simule l'utilisateur avec l'ID 1
    next();
};

// Route pour créer un nouveau template d'email
router.post('/', fakeAuth, templateController.createTemplate);

module.exports = router;