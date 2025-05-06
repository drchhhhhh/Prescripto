import express from 'express';
import { 
  getAllGroups, 
  getGroupById, 
  createGroup, 
  updateGroup, 
  deleteGroup 
} from '../controllers/groupController.js';
import { authenticateUser } from '../middleware/auth.js'; // Assuming you have auth middleware

const router = express.Router();

// Get all groups
router.get('/', authenticateUser, getAllGroups);

// Get group by ID
router.get('/:id', authenticateUser, getGroupById);

// Create new group
router.post('/', authenticateUser, createGroup);

// Update group
router.put('/:id', authenticateUser, updateGroup);

// Delete group
router.delete('/:id', authenticateUser, deleteGroup);

export default router;