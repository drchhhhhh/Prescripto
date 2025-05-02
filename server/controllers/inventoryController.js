const Inventory = require('../models/inventory');
const Medicine = require('../models/medicine');
const Branch = require('../models/branch');

// Get inventory by branch
exports.getInventoryByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { name, category, expiring } = req.query;
    
    // Check if branch exists
    const branch = await Branch.findById(branchId);
    
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    // Build medicine query for filtering
    let medicineQuery = {};
    
    if (name) {
      medicineQuery.name = { $regex: name, $options: 'i' };
    }
    
    if (category) {
      medicineQuery.category = category;
    }
    
    if (expiring === 'true') {
      // Get medicines expiring in the next 30 days
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      medicineQuery.expiration_date = {
        $lte: thirtyDaysFromNow,
        $gte: today
      };
    }
    
    // Find medicines that match the query
    let medicineIds = [];
    if (Object.keys(medicineQuery).length > 0) {
      const medicines = await Medicine.find(medicineQuery);
      medicineIds = medicines.map(med => med._id);
    }
    
    // Get inventory
    const query = { branch: branchId };
    if (medicineIds.length > 0) {
      query.medicine = { $in: medicineIds };
    }
    
    const inventory = await Inventory.find(query)
      .populate({
        path: 'medicine',
        populate: { path: 'category' }
      });
    
    return res.status(200).json(inventory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get inventory item by ID
exports.getInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const inventoryItem = await Inventory.findById(id)
      .populate({
        path: 'medicine',
        populate: { path: 'category' }
      })
      .populate('branch');
    
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    return res.status(200).json(inventoryItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update inventory quantity
exports.updateInventoryQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    const inventoryItem = await Inventory.findById(id);
    
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    // Update quantity
    inventoryItem.quantity = quantity;
    inventoryItem.updated_at = Date.now();
    await inventoryItem.save();
    
    return res.status(200).json(inventoryItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get expiring medicines
exports.getExpiringMedicines = async (req, res) => {
  try {
    const { days } = req.params;
    const { branchId } = req.query;
    
    // Calculate expiration date threshold
    const today = new Date();
    const expirationThreshold = new Date();
    expirationThreshold.setDate(today.getDate() + parseInt(days));
    
    // Find medicines that are expiring
    const expiringMedicines = await Medicine.find({
      expiration_date: {
        $lte: expirationThreshold,
        $gte: today
      }
    });
    
    const expiringMedicineIds = expiringMedicines.map(med => med._id);
    
    // Build query
    const query = {
      medicine: { $in: expiringMedicineIds }
    };
    
    if (branchId) {
      query.branch = branchId;
    }
    
    // Get inventory items with expiring medicines
    const expiringItems = await Inventory.find(query)
      .populate({
        path: 'medicine',
        populate: { path: 'category' }
      })
      .populate('branch');
    
    return res.status(200).json(expiringItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};