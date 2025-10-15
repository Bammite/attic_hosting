const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
// const authMiddleware = require('../middleware/authMiddleware'); // À décommenter quand l'authentification sera en place

// Middleware simple pour simuler un utilisateur authentifié (à remplacer par un vrai middleware)
const fakeAuth = (req, res, next) => {
    req.user = { id: 1 }; // Simule l'utilisateur avec l'ID 1
    next();
};

// Route pour créer un nouveau formulaire
router.post('/', fakeAuth, formController.createForm);

// Route pour récupérer tous les formulaires d'un utilisateur
router.get('/', fakeAuth, formController.getUserForms);

// Route pour soumettre une réponse à un formulaire
router.post('/:id/responses', formController.submitFormResponse);

module.exports = router;