const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
// const authMiddleware = require('../middleware/authMiddleware'); // À décommenter quand l'authentification sera en place
const { protect } = require('../middlewares/authMiddleware');

// Route pour créer un nouveau formulaire
router.post('/', protect, formController.createForm);

// Route pour récupérer tous les formulaires d'un utilisateur
router.get('/', protect, formController.getUserForms);

// Route pour soumettre une réponse à un formulaire
router.post('/:id/responses', formController.submitFormResponse);

module.exports = router;