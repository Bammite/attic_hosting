const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

const { protect } = require('../middlewares/authMiddleware');

// Route pour créer un nouveau contact
router.post('/', protect, contactController.createContact);

// Route pour récupérer tous les contacts
router.get('/', protect, contactController.getContacts);

// Route pour supprimer un contact
router.delete('/:id', protect, contactController.deleteContact);

// Route pour mettre à jour un contact
router.put('/:id', protect, contactController.updateContact);

module.exports = router;