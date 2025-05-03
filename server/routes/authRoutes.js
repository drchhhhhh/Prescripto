import express from 'express';
import { login, getCurrentUser, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: POST /api/auth/login
router.post('/login', login);

// Route: GET /api/auth/me
router.get('/me', protect, getCurrentUser);

// Route: POST /api/auth/logout
router.post('/logout', protect, logout);

export default router;