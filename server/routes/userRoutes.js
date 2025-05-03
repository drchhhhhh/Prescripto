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

// All routes require authentication and admin privileges
router.use(protect, adminOnly);

// Route: GET /api/users
router.get('/', getAllUsers);

// Route: GET /api/users/:id
router.get('/:id', getUserById);

// Route: POST /api/users
router.post('/', createUser);

// Route: PUT /api/users/:id
router.put('/:id', updateUser);

// Route: DELETE /api/users/:id
router.delete('/:id', deleteUser);

export default router;