const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Refresh token
router.post('/refresh-token', verifyToken, authController.refreshToken);

// Change password
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;