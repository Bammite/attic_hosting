const express = require('express');
const router = express.Router();

const formRoutes = require('./formRoutes');
const setupRoutes = require('./setupRoutes');

router.use('/forms', formRoutes);
router.use('/setup', setupRoutes);

module.exports = router;