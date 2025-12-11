const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Route pour récupérer le profil de l'utilisateur connecté
// GET /api/users/me
router.get('/me', protect, getUserProfile);

module.exports = router;