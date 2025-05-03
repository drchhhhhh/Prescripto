const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { verifyToken } = require('../middleware/auth');

// Apply middleware to all routes
router.use(verifyToken);

// Get inventory by branch
router.get('/branch/:branchId', inventoryController.getInventoryByBranch);

// Get inventory item by ID
router.get('/:id', inventoryController.getInventoryItem);

// Update inventory quantity
router.put('/:id/quantity', inventoryController.updateInventoryQuantity);

// Get expiring medicines
router.get('/expiring/:days', inventoryController.getExpiringMedicines);

module.exports = router;