const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

const { protect } = require('../middlewares/authMiddleware');

// Protéger toutes les routes de ce fichier
router.use(protect);

router.get('/email-senders', settingsController.getEmailSenders);
router.post('/email-senders', settingsController.addEmailSender);
router.delete('/email-senders/:id', settingsController.deleteEmailSender);

module.exports = router;