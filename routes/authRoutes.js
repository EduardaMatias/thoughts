const express = require('express');
const router = express.Router();

const AuthController = require('../controlles/AuthController');

router.get('/login', AuthController.login);
router.get('/register', AuthController.register);
router.get('/logout', AuthController.logout);

router.post('/login', AuthController.loginPost);
router.post('/register', AuthController.registerPost);

module.exports = router;