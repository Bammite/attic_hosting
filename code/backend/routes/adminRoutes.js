const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

// Middleware pour vérifier si l'utilisateur est un admin
const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ message: "Accès refusé. Vous n'avez pas les droits d'administrateur." });
};

router.get('/users', protect, checkAdmin, adminController.getAllUsers);
router.post('/users', protect, checkAdmin, adminController.createUser);
router.delete('/users/:id', protect, checkAdmin, adminController.deleteUser);

module.exports = router;