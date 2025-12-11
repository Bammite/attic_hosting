const express = require('express');
const router = express.Router();
const mailerController = require('../controllers/mailerController');

const { protect } = require('../middlewares/authMiddleware');

// Route pour envoyer un email
router.post('/send', protect, mailerController.sendEmail);

module.exports = router;