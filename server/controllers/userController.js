import User from '../models/User.js';

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    let users;
    
    // If admin, return all user data except password
    if (req.user.role === 'Admin') {
      users = await User.find().select('-password');
    } 
    // If staff, return limited user data
    else {
      users = await User.find().select('_id username role');
    }
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by ID (Admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If admin or the user is requesting their own data, return full data
    if (req.user.role === 'Admin' || req.user.id === req.params.id) {
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt
      });
    }
    
    // For staff requesting other users' data, return limited data
    res.status(200).json({
      _id: user._id,
      username: user.username,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new user (Admin only)
export const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const user = await User.create({
      username,
      password,
      role
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { username, role } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (username) user.username = username;
    if (role) user.role = role;
    
    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};