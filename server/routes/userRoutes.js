import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes that don't require admin privileges
// Route: GET /api/users
router.get('/', getAllUsers);

// Route: GET /api/users/:id
router.get('/:id', getUserById);

// Routes that require admin privileges
// Route: POST /api/users
router.post('/', adminOnly, createUser);

// Route: PUT /api/users/:id
router.put('/:id', adminOnly, updateUser);

// Route: DELETE /api/users/:id
router.delete('/:id', adminOnly, deleteUser);

export default router;