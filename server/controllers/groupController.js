import Group from "../models/Group.js";

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

    const group = new Group({
      name,
      description: description || "",
      emoji: emoji || "💊",
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", details: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update group
export const updateGroup = async (req, res) => {
  try {
    const { name, description, emoji } = req.body;

    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // If name is being changed, check if the new name already exists
    if (name && name !== group.name) {
      const existingGroup = await Group.findOne({ name });
      if (existingGroup) {
        return res.status(400).json({ message: "A group with this name already exists" });
      }
    }

    // Update group fields
    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    if (emoji) group.emoji = emoji;
    
    group.updatedAt = Date.now();

    await group.save();
    res.status(200).json(group);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", details: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete group
export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Note: You might want to check if any medicines are using this group
    // before deleting it, and either prevent deletion or update those medicines

    await group.deleteOne();
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};