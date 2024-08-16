const { Router } = require('express');
const router = Router();
const { login, register } = require('../controller.js/studentcredentails')

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

module.exports = router;
