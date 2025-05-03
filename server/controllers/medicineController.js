import Medicine from '../models/Medicine.js';

// Get all medicines
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get medicine by ID
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new medicine
export const createMedicine = async (req, res) => {
  try {
    const { name, category, price, quantity, expirationDate } = req.body;

    const medicine = await Medicine.create({
      name,
      category,
      price,
      quantity,
      expirationDate
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update medicine
export const updateMedicine = async (req, res) => {
  try {
    const { name, category, price, quantity, expirationDate } = req.body;
    
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Update medicine fields
    if (name) medicine.name = name;
    if (category) medicine.category = category;
    if (price !== undefined) medicine.price = price;
    if (quantity !== undefined) medicine.quantity = quantity;
    if (expirationDate) medicine.expirationDate = expirationDate;
    
    medicine.updatedAt = Date.now();

    const updatedMedicine = await medicine.save();
    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete medicine
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    await medicine.deleteOne();
    res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get medicines by expiration status
export const getMedicinesByExpirationStatus = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const expired = await Medicine.find({ expirationDate: { $lt: today } });
    const expiringSoon = await Medicine.find({
      expirationDate: { $gte: today, $lte: thirtyDaysFromNow }
    });
    const valid = await Medicine.find({ expirationDate: { $gt: thirtyDaysFromNow } });

    res.status(200).json({
      expired,
      expiringSoon,
      valid
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};