const express = require('express');
const router = express.Router();
const authRoutes = require('./auth')
const groupRoutes = require('./group')
const checkAdmin = require('../../app/middlewares/checkAdmin')

router.use('/auth', authRoutes);
router.use('/group', groupRoutes);


module.exports = router;