import Transaction from '../models/Transaction.js';
import Medicine from '../models/Medicine.js';
import mongoose from 'mongoose';

// Get all transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('items.medicine', 'name category price')
      .populate('createdBy', 'username');
    
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('items.medicine', 'name category price')
      .populate('createdBy', 'username');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get transaction by receipt number
export const getTransactionByReceiptNumber = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ receiptNumber: req.params.receiptNumber })
      .populate('items.medicine', 'name category price')
      .populate('createdBy', 'username');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get transactions by date range
export const getTransactionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set to end of day
    
    const transactions = await Transaction.find({
      createdAt: { $gte: start, $lte: end }
    })
      .populate('items.medicine', 'name category price')
      .populate('createdBy', 'username');
    
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new transaction
export const createTransaction = async (req, res) => {
  // Start a MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required and must be an array' });
    }

    // Validate and process each item
    const processedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const { medicineId, quantity } = item;
      
      if (!medicineId || !quantity || quantity <= 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          message: 'Each item must have a valid medicineId and a positive quantity' 
        });
      }

      // Find the medicine and check if it exists
      const medicine = await Medicine.findById(medicineId).session(session);
      if (!medicine) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: `Medicine with ID ${medicineId} not found` });
      }

      // Check if there's enough quantity in stock
      if (medicine.quantity < quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          message: `Insufficient stock for ${medicine.name}. Available: ${medicine.quantity}, Requested: ${quantity}` 
        });
      }

      // Calculate item total
      const itemTotal = medicine.price * quantity;
      totalAmount += itemTotal;

      // Add to processed items
      processedItems.push({
        medicine: medicineId,
        quantity: quantity,
        price: medicine.price
      });

      // Update medicine quantity
      medicine.quantity -= quantity;
      await medicine.save({ session });
    }

    // Create the transaction
    const transaction = new Transaction({
      items: processedItems,
      totalAmount,
      createdBy: req.user._id
    });

    await transaction.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Populate the response data
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('items.medicine', 'name category price')
      .populate('createdBy', 'username');

    res.status(201).json(populatedTransaction);
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};