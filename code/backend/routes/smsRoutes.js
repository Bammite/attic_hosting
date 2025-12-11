const express = require('express');
const { sendSmsController } = require('../controllers/smsController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// On définit une route POST sur /send
// Quand une requête POST arrive sur /api/sms/send, elle sera gérée par sendSmsController
router.post('/send', protect, sendSmsController);

module.exports = router;
