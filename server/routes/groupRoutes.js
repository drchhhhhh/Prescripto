import express from 'express';
import { 
  getAllGroups, 
  getGroupById, 
  createGroup, 
  deleteGroup,
  getMedicinesCountByGroup
} from '../controllers/groupController.js';
import { protect, adminOnly } from '../middleware/auth.js'; // Updated import for auth middleware

const router = express.Router();

// Get all groups - accessible to all authenticated users
router.get('/', protect, getAllGroups);

// Get medicine count by group - accessible to all authenticated users
router.get('/:id/medicines/count', protect, getMedicinesCountByGroup);

// Get group by ID - accessible to all authenticated users
router.get('/:id', protect, getGroupById);

// Create new group - admin only
router.post('/', protect, adminOnly, createGroup);

// Delete group - admin only
router.delete('/:id', protect, adminOnly, deleteGroup);

export default router;