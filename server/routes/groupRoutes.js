import express from 'express';
import { 
  getAllGroups, 
  getGroupById, 
  createGroup, 
  updateGroup, 
  deleteGroup 
} from '../controllers/groupController.js';
import { protect } from "../middleware/auth.js"

const router = express.Router();

// Get all groups
router.get('/', protect, getAllGroups);

// Get group by ID
router.get('/:id', protect, getGroupById);

// Create new group
router.post('/', protect, createGroup);

// Update group
router.put('/:id', protect, updateGroup);

// Delete group
router.delete('/:id', protect, deleteGroup);

export default router;