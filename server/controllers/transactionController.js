import Transaction from "../models/Transaction.js"
import Medicine from "../models/Medicine.js"
import mongoose from "mongoose"

// Helper function to extract branch from username
const extractBranchFromUsername = (username) => {
  // Remove "_Admin" or "_User" suffix if present
  return username.replace(/_Admin$|_User$/, "")
}

// Get all transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("items.medicine", "name category price")
      .populate("createdBy", "username")

    res.status(200).json(transactions)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("items.medicine", "name category price")
      .populate("createdBy", "username")

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    res.status(200).json(transaction)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get transaction by receipt number
export const getTransactionByReceiptNumber = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ receiptNumber: req.params.receiptNumber })
      .populate("items.medicine", "name category price")
      .populate("createdBy", "username")

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    res.status(200).json(transaction)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get transactions by date range
export const getTransactionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999) // Set to end of day

    const transactions = await Transaction.find({
      createdAt: { $gte: start, $lte: end },
    })
      .populate("items.medicine", "name category price")
      .populate("createdBy", "username")

    res.status(200).json(transactions)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create a new purchase transaction
export const createTransaction = async (req, res) => {
  // Start a MongoDB session for transaction
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { items, notes } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required and must be an array" })
    }

    // Extract branch from username
    const branch = extractBranchFromUsername(req.user.username)

    // Validate and process each item
    const processedItems = []
    let totalAmount = 0

    for (const item of items) {
      const { medicineId, quantity } = item

      if (!medicineId || !quantity || quantity <= 0) {
        await session.abortTransaction()
        session.endSession()
        return res.status(400).json({
          message: "Each item must have a valid medicineId and a positive quantity",
        })
      }

      // Find the medicine and check if it exists
      const medicine = await Medicine.findById(medicineId).session(session)
      if (!medicine) {
        await session.abortTransaction()
        session.endSession()
        return res.status(404).json({ message: `Medicine with ID ${medicineId} not found` })
      }

      // Check if medicine belongs to the same branch
      if (medicine.branch !== branch) {
        await session.abortTransaction()
        session.endSession()
        return res.status(403).json({
          message: `Medicine with ID ${medicineId} belongs to a different branch and cannot be accessed`,
        })
      }

      // Check if there's enough quantity in stock
      if (medicine.quantity < quantity) {
        await session.abortTransaction()
        session.endSession()
        return res.status(400).json({
          message: `Insufficient stock for ${medicine.name}. Available: ${medicine.quantity}, Requested: ${quantity}`,
        })
      }

      // Calculate item total
      const itemTotal = medicine.price * quantity
      totalAmount += itemTotal

      // Add to processed items
      processedItems.push({
        medicine: medicineId,
        quantity: quantity,
        price: medicine.price,
      })

      // Update medicine quantity
      medicine.quantity -= quantity
      await medicine.save({ session })
    }

    // Generate receipt number manually
    const receiptNumber = await Transaction.generateReceiptNumber("purchase")

    // Create the transaction with the generated receipt number
    const transaction = new Transaction({
      receiptNumber,
      transactionType: "purchase",
      items: processedItems,
      totalAmount,
      branch, // Add branch from username
      createdBy: req.user._id,
      notes: notes || "Customer purchase",
    })

    await transaction.save({ session })

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    // Populate the response data
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("items.medicine", "name category price")
      .populate("createdBy", "username")

    // Generate receipt data
    const receipt = {
      receiptNumber: populatedTransaction.receiptNumber,
      date: populatedTransaction.createdAt,
      branch: populatedTransaction.branch,
      items: populatedTransaction.items.map((item) => ({
        name: item.medicine.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
      totalAmount: populatedTransaction.totalAmount,
      cashier: populatedTransaction.createdBy.username,
      notes: populatedTransaction.notes,
    }

    res.status(201).json({
      transaction: populatedTransaction,
      receipt,
    })
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction()
    session.endSession()

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", details: error.message })
    }

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" })
    }

    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get transactions by branch
export const getTransactionsByBranch = async (req, res) => {
  try {
    const { branch } = req.params

    const transactions = await Transaction.find({ branch })
      .populate("items.medicine", "name category price")
      .populate("createdBy", "username")

    res.status(200).json(transactions)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get transactions for current user's branch
export const getTransactionsForCurrentBranch = async (req, res) => {
  try {
    const branch = extractBranchFromUsername(req.user.username)

    const transactions = await Transaction.find({ branch })
      .populate("items.medicine", "name category price")
      .populate("createdBy", "username")

    res.status(200).json(transactions)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
