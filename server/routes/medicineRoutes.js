const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all medicines
router.get('/', verifyToken, medicineController.getAllMedicines);

// Get medicine by ID
router.get('/:id', verifyToken, medicineController.getMedicineById);

// Admin-only routes
router.post('/', verifyToken, isAdmin, medicineController.createMedicine);
router.put('/:id', verifyToken, isAdmin, medicineController.updateMedicine);
router.delete('/:id', verifyToken, isAdmin, medicineController.deleteMedicine);

module.exports = router;