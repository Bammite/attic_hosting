const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

const { protect } = require('../middlewares/authMiddleware');

// Route pour créer un nouveau template d'email
router.post('/', protect, templateController.createTemplate);

module.exports = router;