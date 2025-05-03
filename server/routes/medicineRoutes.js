import express from 'express';
import { 
  getAllMedicines, 
  getMedicineById, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine,
  getMedicinesByExpirationStatus
} from '../controllers/medicineController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Route: GET /api/medicines
router.get('/', getAllMedicines);

// Route: GET /api/medicines/expiration
router.get('/expiration', getMedicinesByExpirationStatus);

// Route: GET /api/medicines/:id
router.get('/:id', getMedicineById);

// Route: POST /api/medicines - Admin and Staff can create
router.post('/', createMedicine);

// Route: PUT /api/medicines/:id - Admin and Staff can update
router.put('/:id', updateMedicine);

// Route: DELETE /api/medicines/:id - Admin only
router.delete('/:id', adminOnly, deleteMedicine);

export default router;