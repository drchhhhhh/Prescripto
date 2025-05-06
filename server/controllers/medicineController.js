import Medicine from "../models/Medicine.js";
import Transaction from "../models/Transaction.js";
import Group from "../models/Group.js"; // Import the Group model
import mongoose from "mongoose";

// Helper function to extract branch name from username
const extractBranchFromUsername = (username) => {
  // Remove "_Admin" or "_User" suffix if present
  return username.replace(/_Admin$|_User$/, "");
};

// Get all medicines
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get medicine by ID
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new medicine
export const createMedicine = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, category, description, sideEffects, price, quantity, expirationDate, notes } = req.body;

    // Validate that the category exists as a group
    const group = await Group.findOne({ name: category }).session(session);
    if (!group) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        message: "Invalid category. Category must match an existing group name." 
      });
    }

    // Extract branch from username
    const branch = extractBranchFromUsername(req.user.username);

    // Create the medicine
    const medicine = new Medicine({
      name,
      category,
      description: description || "",
      sideEffects: sideEffects || "No known side effects documented.",
      price,
      quantity,
      expirationDate,
      branch, // Add branch from username
      group: group._id // Add reference to the group
    });

    await medicine.save({ session });

    // Generate receipt number for the restock transaction
    const receiptNumber = await Transaction.generateReceiptNumber("restock");

    // Create a restock transaction
    const transaction = new Transaction({
      receiptNumber,
      transactionType: "restock",
      items: [
        {
          medicine: medicine._id,
          quantity,
          price,
        },
      ],
      totalAmount: price * quantity,
      branch, // Add branch from username
      createdBy: req.user._id,
      notes: notes || `Initial stock of ${name}`,
    });

    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(medicine);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", details: error.message });
    }
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update medicine
export const updateMedicine = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, category, description, sideEffects, price, quantity, expirationDate, notes } = req.body;

    const medicine = await Medicine.findById(req.params.id).session(session);
    if (!medicine) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Medicine not found" });
    }

    // If category is being updated, validate that it exists as a group
    if (category && category !== medicine.category) {
      const group = await Group.findOne({ name: category }).session(session);
      if (!group) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          message: "Invalid category. Category must match an existing group name." 
        });
      }
      
      // Update the group reference
      medicine.group = group._id;
    }

    // Check if quantity is being increased (restocking)
    const isRestocking = quantity !== undefined && quantity > medicine.quantity;
    const oldQuantity = medicine.quantity;

    // Update medicine fields
    if (name) medicine.name = name;
    if (category) medicine.category = category;
    if (description !== undefined) medicine.description = description;
    if (sideEffects !== undefined) medicine.sideEffects = sideEffects;
    if (price !== undefined) medicine.price = price;
    if (quantity !== undefined) medicine.quantity = quantity;
    if (expirationDate) medicine.expirationDate = expirationDate;

    // Update branch if not already set (for existing records)
    if (!medicine.branch) {
      medicine.branch = extractBranchFromUsername(req.user.username);
    }

    medicine.updatedAt = Date.now();

    await medicine.save({ session });

    // If restocking, create a transaction
    if (isRestocking) {
      const restockQuantity = quantity - oldQuantity;
      const currentPrice = price !== undefined ? price : medicine.price;

      // Generate receipt number for the restock transaction
      const receiptNumber = await Transaction.generateReceiptNumber("restock");

      const transaction = new Transaction({
        receiptNumber,
        transactionType: "restock",
        items: [
          {
            medicine: medicine._id,
            quantity: restockQuantity,
            price: currentPrice,
          },
        ],
        totalAmount: currentPrice * restockQuantity,
        branch: medicine.branch,
        createdBy: req.user._id,
        notes: notes || `Restocked ${medicine.name}`,
      });

      await transaction.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(medicine);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", details: error.message });
    }
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete medicine
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    await medicine.deleteOne();
    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
      expirationDate: { $gte: today, $lte: thirtyDaysFromNow },
    });
    const valid = await Medicine.find({ expirationDate: { $gt: thirtyDaysFromNow } });

    res.status(200).json({
      expired,
      expiringSoon,
      valid,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get medicines by group
export const getMedicinesByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const medicines = await Medicine.find({ group: groupId });
    
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};