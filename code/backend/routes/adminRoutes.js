const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware pour simuler un utilisateur authentifié (à remplacer par votre vrai middleware)
const fakeAuth = (req, res, next) => {
    // Pour tester, on peut simuler un admin ou un user
    req.user = { id: 1, role: 'admin' }; // Simule un admin
    // req.user = { id: 2, role: 'user' }; // Simule un user normal
    next();
};

// Middleware pour vérifier si l'utilisateur est un admin
const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ message: "Accès refusé. Vous n'avez pas les droits d'administrateur." });
};

router.get('/users', fakeAuth, checkAdmin, adminController.getAllUsers);
router.post('/users', fakeAuth, checkAdmin, adminController.createUser);
router.delete('/users/:id', fakeAuth, checkAdmin, adminController.deleteUser);

module.exports = router;