const express = require('express');
const router = express.Router();
const { initializeDatabase } = require('../controllers/setupController');

// Route pour GET /api/setup/initialize
// ATTENTION : En production, cette route devrait être protégée ou supprimée.
router.get('/initialize', initializeDatabase);

module.exports = router;

