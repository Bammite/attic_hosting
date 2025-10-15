const express = require('express');
const router = express.Router();

const formRoutes = require('./formRoutes');
const contactRoutes = require('./contactRoutes');
const templateRoutes = require('./templateRoutes');
const authRoutes = require('./authRoutes');
const settingsRoutes = require('./settingsRoutes');
const mailerRoutes = require('./mailerRoutes');
const adminRoutes = require('./adminRoutes');
const setupRoutes = require('./setupRoutes');

router.use('/forms', formRoutes);
router.use('/contacts', contactRoutes);
router.use('/templates', templateRoutes);
router.use('/auth', authRoutes);
router.use('/settings', settingsRoutes);
router.use('/mailer', mailerRoutes);
router.use('/admin', adminRoutes);
router.use('/setup', setupRoutes);

module.exports = router;
