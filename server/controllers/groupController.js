import Group from "../models/Group.js";
import Medicine from "../models/Medicine.js";
import mongoose from "mongoose";

// Helper function to extract branch from username
const extractBranchFromUsername = (username) => {
  // Remove "_Admin" or "_User" suffix if present
  return username.replace(/_Admin$|_User$/, "");
};

// Get all groups
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().sort({ name: 1 });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get group by ID
export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new group
export const createGroup = async (req, res) => {
  try {
    const { name, description, emoji } = req.body;

    // Check if group with the same name already exists
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: "A group with this name already exists" });
    }

    // Create new group with creator information
    const group = new Group({
      name,
      description: description || "",
      emoji: emoji || "💊",
      createdBy: req.user._id, // Add reference to the user who created the group
    });

    await group.save();
    
    // Log the action
    console.log(`Group "${name}" created by ${req.user.username} (${req.user._id})`);
    
    res.status(201).json(group);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", details: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete group and all associated medicines
export const deleteGroup = async (req, res) => {
  // Start a MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const group = await Group.findById(req.params.id).session(session);
    if (!group) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Group not found" });
    }

    // Find all medicines that belong to this group
    const medicines = await Medicine.find({ 
      $or: [
        { group: group._id },
        { category: group.name }
      ]
    }).session(session);

    // Get count of medicines to be deleted
    const medicineCount = medicines.length;
    
    // Store group name for logging
    const groupName = group.name;

    // Delete all medicines that belong to this group
    await Medicine.deleteMany({ 
      $or: [
        { group: group._id },
        { category: group.name }
      ]
    }).session(session);

    // Delete the group
    await group.deleteOne({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    // Log the action
    console.log(`Group "${groupName}" and ${medicineCount} associated medicines deleted by ${req.user.username} (${req.user._id})`);

    res.status(200).json({ 
      message: `Group deleted successfully along with ${medicineCount} associated medicines` 
    });
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get medicines count by group
export const getMedicinesCountByGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    // Count medicines that belong to this group
    const medicineCount = await Medicine.countDocuments({ 
      $or: [
        { group: groupId },
        { category: group.name }
      ]
    });
    
    res.status(200).json({ 
      group: group.name,
      medicineCount
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};