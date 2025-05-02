const Medicine = require('../models/medicine');
const Category = require('../models/category');

// Get all medicines with optional filters
exports.getAllMedicines = async (req, res) => {
  try {
    const { name, category, expiring } = req.query;
    
    const query = {};
    
    // Apply filters if provided
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (expiring === 'true') {
      // Get medicines expiring in the next 30 days
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      query.expiration_date = {
        $lte: thirtyDaysFromNow,
        $gte: today
      };
    }
    
    const medicines = await Medicine.find(query).populate('category');
    
    return res.status(200).json(medicines);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get medicine by ID
exports.getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const medicine = await Medicine.findById(id).populate('category');
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    return res.status(200).json(medicine);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create medicine (Admin only)
exports.createMedicine = async (req, res) => {
  try {
    const { name, category, price, expiration_date } = req.body;
    
    // Check if category exists
    const categoryExists = await Category.findById(category);
    
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Create medicine
    const newMedicine = new Medicine({
      name,
      category,
      price,
      expiration_date
    });
    
    await newMedicine.save();
    
    return res.status(201).json(newMedicine);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update medicine (Admin only)
exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, expiration_date } = req.body;
    
    const medicine = await Medicine.findById(id);
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    // If category is provided, check if it exists
    if (category) {
      const categoryExists = await Category.findById(category);
      
      if (!categoryExists) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      medicine.category = category;
    }
    
    // Update medicine
    if (name) medicine.name = name;
    if (price) medicine.price = price;
    if (expiration_date) medicine.expiration_date = expiration_date;
    
    medicine.updated_at = Date.now();
    await medicine.save();
    
    return res.status(200).json(medicine);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete medicine (Admin only)
exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    
    const medicine = await Medicine.findById(id);
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    await medicine.deleteOne();
    
    return res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};