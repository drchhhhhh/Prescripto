import Transaction from "../models/Transaction.js";
import Medicine from "../models/Medicine.js";

// Helper function to extract branch from username
const extractBranchFromUsername = (username) => {
  // Remove "_Admin" or "_User" suffix if present
  return username.replace(/_Admin$|_User$/, "");
};

// Get all dashboard statistics for the current branch
export const getDashboardStats = async (req, res) => {
  try {
    const branch = extractBranchFromUsername(req.user.username);
    
    // Get all medicines for the branch
    const medicines = await Medicine.find({ branch });
    
    // Get all transactions for the branch
    const transactions = await Transaction.find({ branch })
      .populate("items.medicine", "name category price")
      .populate("createdBy", "username");
    
    // Calculate inventory status
    const inventoryStatus = await calculateInventoryStatus(medicines);
    
    // Calculate revenue
    const revenue = transactions.reduce((total, transaction) => {
      return total + transaction.totalAmount;
    }, 0);
    
    // Count medicines available
    const medicinesAvailable = medicines.length;
    
    // Count medicine shortages
    const medicineShortage = medicines.filter(medicine => medicine.quantity === 0).length;
    
    // Count medicine groups (categories)
    const categories = new Set(medicines.map(medicine => medicine.category));
    const medicineGroups = categories.size;
    
    // Calculate total quantity of medicines sold
    const medicinesSold = transactions.reduce((total, transaction) => {
      if (transaction.transactionType === "purchase") {
        return total + transaction.items.reduce((itemTotal, item) => {
          return itemTotal + item.quantity;
        }, 0);
      }
      return total;
    }, 0);
    
    // Count invoices generated (purchase transactions)
    const invoicesGenerated = transactions.filter(transaction => 
      transaction.transactionType === "purchase"
    ).length;
    
    // Count total customers (unique transactions)
    const totalCustomers = transactions.filter(transaction => 
      transaction.transactionType === "purchase"
    ).length;
    
    // Find frequently bought item
    const frequentlyBoughtItem = await findFrequentlyBoughtItem(transactions);
    
    res.status(200).json({
      inventoryStatus,
      revenue,
      medicinesAvailable,
      medicineShortage,
      totalMedicines: medicinesAvailable,
      medicineGroups,
      medicinesSold,
      invoicesGenerated,
      totalSuppliers: "", // Keeping blank as requested
      totalCustomers,
      frequentlyBoughtItem
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Calculate inventory status based on medicine quantities
const calculateInventoryStatus = async (medicines) => {
  if (!medicines.length) return "No Data";
  
  // Count medicines with zero quantity
  const shortages = medicines.filter(medicine => medicine.quantity === 0).length;
  
  // Count medicines with low quantity (less than 10)
  const lowStock = medicines.filter(medicine => medicine.quantity > 0 && medicine.quantity < 10).length;
  
  // Calculate percentage of medicines with issues
  const issuePercentage = ((shortages + lowStock) / medicines.length) * 100;
  
  if (issuePercentage < 10) return "Good";
  if (issuePercentage < 30) return "Fair";
  return "Critical";
};

// Find the most frequently bought medicine
const findFrequentlyBoughtItem = async (transactions) => {
  // Create a map to count occurrences of each medicine
  const medicineCount = {};
  
  // Count occurrences of each medicine in purchase transactions
  transactions.forEach(transaction => {
    if (transaction.transactionType === "purchase") {
      transaction.items.forEach(item => {
        const medicineId = item.medicine._id.toString();
        const medicineName = item.medicine.name;
        
        if (!medicineCount[medicineId]) {
          medicineCount[medicineId] = {
            name: medicineName,
            count: 0
          };
        }
        
        medicineCount[medicineId].count += item.quantity;
      });
    }
  });
  
  // Find the medicine with the highest count
  let maxCount = 0;
  let frequentItem = "None";
  
  Object.values(medicineCount).forEach(item => {
    if (item.count > maxCount) {
      maxCount = item.count;
      frequentItem = item.name;
    }
  });
  
  return frequentItem;
};

// Get inventory status
export const getInventoryStatus = async (req, res) => {
  try {
    const branch = extractBranchFromUsername(req.user.username);
    const medicines = await Medicine.find({ branch });
    const status = await calculateInventoryStatus(medicines);
    
    res.status(200).json({ status });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get revenue
export const getRevenue = async (req, res) => {
  try {
    const branch = extractBranchFromUsername(req.user.username);
    const { startDate, endDate } = req.query;
    
    let dateFilter = { branch };
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of day
      
      dateFilter.createdAt = { $gte: start, $lte: end };
    }
    
    const transactions = await Transaction.find(dateFilter);
    
    const revenue = transactions.reduce((total, transaction) => {
      return total + transaction.totalAmount;
    }, 0);
    
    res.status(200).json({ revenue });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get medicines available
export const getMedicinesAvailable = async (req, res) => {
  try {
    const branch = extractBranchFromUsername(req.user.username);
    const count = await Medicine.countDocuments({ branch });
    
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get medicine shortage
export const getMedicineShortage = async (req, res) => {
  try {
    const branch = extractBranchFromUsername(req.user.username);
    const count = await Medicine.countDocuments({ branch, quantity: 0 });
    
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get total medicines
export const getTotalMedicines = async (req, res) => {
  try {
    const branch = extractBranchFromUsername(req.user.username);
    const count = await Medicine.countDocuments({ branch });
    
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get medicine groups (categories)
export const getMedicineGroups = async (req, res) => {
  try {
    const branch = extractBranchFromUsername(req.user.username);
    const medicines = await Medicine.find({ branch });
    
    const categories = new Set(medicines.map(medicine => medicine.category));
    
    res.status(200).json({ count: categories.size });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get medicines sold
export const getMedicinesSold = async (req, res) => {
  try {
    const branch = extractBranchFromUsername(req.user.username);
    const { startDate, endDate } = req.query;
    
    let dateFilter = { branch, transactionType: "purchase" };
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of day
      
      dateFilter.createdAt = { $gte: start, $lte: end };
    }
    
    const transactions = await Transaction.find(dateFilter);
    
    const totalSold = transactions.reduce((total, transaction) => {
      return total + transaction.items.reduce((itemTotal, item) => {
        return itemTotal + item.quantity;
      }, 0);
    }, 0);
    
    res.status(200).json({ count: totalSold });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get invoices generated
export const getInvoicesGenerated = async (req, res) => {
  try {
    const branch = extractBranchFromUsername(req.user.username);
    const { startDate, endDate } = req.query;
    
    let dateFilter = { branch, transactionType: "purchase" };
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of day
      
      dateFilter.createdAt = { $gte: start, $lte: end };
    }
    
    const count = await Transaction.countDocuments(dateFilter);
    
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get total customers
export const getTotalCustomers = async (req, res) => {
  try {
    const branch = extractBranchFromUsername(req.user.username);
    
    // Count unique purchase transactions as customers
    const count = await Transaction.countDocuments({ 
      branch, 
      transactionType: "purchase" 
    });
    
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get frequently bought item
export const getFrequentlyBoughtItem = async (req, res) => {
  try {
    const branch = extractBranchFromUsername(req.user.username);
    const transactions = await Transaction.find({ 
      branch, 
      transactionType: "purchase" 
    }).populate("items.medicine", "name");
    
    const frequentItem = await findFrequentlyBoughtItem(transactions);
    
    res.status(200).json({ item: frequentItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};