const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/auth');

// Login user and return JWT token
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      config.secret,
      { expiresIn: config.expiresIn }
    );
    
    return res.status(200).json({
      id: user._id,
      username: user.username,
      role: user.role,
      accessToken: token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Logout user (client-side)
exports.logout = (req, res) => {
  return res.status(200).json({ message: 'Logout successful' });
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { id } = req.user;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate new JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      config.secret,
      { expiresIn: config.expiresIn }
    );
    
    return res.status(200).json({ accessToken: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password_hash = hashedPassword;
    user.updated_at = Date.now();
    await user.save();
    
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};