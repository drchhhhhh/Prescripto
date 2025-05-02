const Transaction = require('../models/transaction');
const TransactionItem = require('../models/transactionItem');
const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Medicine = require('../models/medicine');
const Inventory = require('../models/inventory');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Create transaction from cart
exports.createTransaction = async (req, res) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { cartId, paymentMethod } = req.body;
    
    // Get cart with items
    const cart = await Cart.findById(cartId)
      .populate({
        path: 'items',
        populate: {
          path: 'medicine'
        }
      })
      .session(session);
    
    if (!cart) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    if (cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Calculate total
    let totalAmount = 0;
    
    for (const item of cart.items) {
      totalAmount += item.medicine.price * item.quantity;
      
      // Check inventory
      const inventory = await Inventory.findOne({
        medicine: item.medicine._id,
        branch: cart.branch
      }).session(session);
      
      if (!inventory || inventory.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Insufficient inventory for ${item.medicine.name}`
        });
      }
      
      // Update inventory
      inventory.quantity -= item.quantity;
      inventory.updated_at = Date.now();
      await inventory.save({ session });
    }
    
    // Generate receipt number
    const receiptNumber = `RCP-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    // Create transaction
    const transaction = new Transaction({
      receipt_number: receiptNumber,
      user: cart.user,
      branch: cart.branch,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      items: []
    });
    
    await transaction.save({ session });
    
    // Create transaction items
    for (const item of cart.items) {
      const transactionItem = new TransactionItem({
        transaction: transaction._id,
        medicine: item.medicine._id,
        quantity: item.quantity,
        unit_price: item.medicine.price,
        subtotal: item.medicine.price * item.quantity
      });
      
      await transactionItem.save({ session });
      
      // Add item to transaction's items array
      transaction.items.push(transactionItem._id);
    }
    
    await transaction.save({ session });
    
    // Clear cart items
    await CartItem.deleteMany({ cart: cartId }).session(session);
    
    // Update cart's items array
    cart.items = [];
    await cart.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    // Get complete transaction with items
    const completeTransaction = await Transaction.findById(transaction._id)
      .populate({
        path: 'items',
        populate: {
          path: 'medicine'
        }
      });
    
    return res.status(201).json(completeTransaction);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await Transaction.findById(id)
      .populate({
        path: 'items',
        populate: {
          path: 'medicine'
        }
      });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    return res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get transactions by branch
exports.getTransactionsByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { startDate, endDate, receiptNumber } = req.query;
    
    const query = { branch: branchId };
    
    // Apply filters if provided
    if (startDate && endDate) {
      query.transaction_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (receiptNumber) {
      query.receipt_number = { $regex: receiptNumber, $options: 'i' };
    }
    
    const transactions = await Transaction.find(query)
      .populate({
        path: 'items',
        populate: {
          path: 'medicine'
        }
      })
      .sort({ transaction_date: -1 });
    
    return res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get transactions by date range
exports.getTransactionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { branchId } = req.query;
    
    const query = {};
    
    if (startDate && endDate) {
      query.transaction_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (branchId) {
      query.branch = branchId;
    }
    
    const transactions = await Transaction.find(query)
      .populate({
        path: 'items',
        populate: {
          path: 'medicine'
        }
      })
      .sort({ transaction_date: -1 });
    
    return res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Generate receipt
exports.generateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await Transaction.findById(id)
      .populate({
        path: 'items',
        populate: {
          path: 'medicine'
        }
      });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Format receipt data
    const receiptData = {
      receiptNumber: transaction.receipt_number,
      date: transaction.transaction_date,
      items: transaction.items.map(item => ({
        name: item.medicine.name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        subtotal: item.subtotal
      })),
      totalAmount: transaction.total_amount,
      paymentMethod: transaction.payment_method
    };
    
    return res.status(200).json(receiptData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};