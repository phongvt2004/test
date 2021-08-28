const express = require('express');
const router = express.Router();
const AuthController = require('../../app/controllers/AuthController')

router.post('/login', AuthController.login);
router.post('/register', AuthController.registerConfirm, AuthController.register);
router.get('/logout', AuthController.logout);

module.exports = router
