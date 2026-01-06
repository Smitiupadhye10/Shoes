// /backend/server/controllers/userController.js
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, dateOfBirth, gender } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;

    await user.save();
    
    res.json({ 
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Add address
export const addAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { 
      type, 
      addressLine1, 
      addressLine2, 
      city, 
      state, 
      postalCode, 
      country, 
      phone, 
      name,
      isDefault 
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newAddress = {
      type,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country: country || 'India',
      phone,
      name,
      isDefault: isDefault || false
    };

    // If setting as default, unset default for other addresses
    if (isDefault) {
      user.addresses = user.addresses.map(addr => ({
        ...addr.toObject(),
        isDefault: false
      }));
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ 
      message: 'Address added successfully',
      address: user.addresses[user.addresses.length - 1]
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { addressId } = req.params;
    const { 
      type, 
      addressLine1, 
      addressLine2, 
      city, 
      state, 
      postalCode, 
      country, 
      phone, 
      name,
      isDefault 
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If setting as default, unset default for other addresses
    if (isDefault) {
      user.addresses = user.addresses.map((addr, idx) => ({
        ...addr.toObject(),
        isDefault: idx === addressIndex
      }));
    } else {
      user.addresses[addressIndex] = {
        ...user.addresses[addressIndex].toObject(),
        type: type || user.addresses[addressIndex].type,
        addressLine1: addressLine1 || user.addresses[addressIndex].addressLine1,
        addressLine2: addressLine2 !== undefined ? addressLine2 : user.addresses[addressIndex].addressLine2,
        city: city || user.addresses[addressIndex].city,
        state: state || user.addresses[addressIndex].state,
        postalCode: postalCode || user.addresses[addressIndex].postalCode,
        country: country || user.addresses[addressIndex].country || 'India',
        phone: phone || user.addresses[addressIndex].phone,
        name: name || user.addresses[addressIndex].name,
        isDefault: user.addresses[addressIndex].isDefault
      };
    }

    await user.save();
    
    res.json({ 
      message: 'Address updated successfully',
      address: user.addresses[addressIndex]
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();
    
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Unset default for all addresses, then set the selected one as default
    user.addresses = user.addresses.map((addr, idx) => ({
      ...addr.toObject(),
      isDefault: idx === addressIndex
    }));

    await user.save();
    
    res.json({ 
      message: 'Default address updated successfully',
      address: user.addresses[addressIndex]
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password
export const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update preferences
export const updatePreferences = async (req, res) => {
  try {
    const { newsletter, notifications, theme } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update preferences
    if (newsletter !== undefined) user.preferences.newsletter = newsletter;
    if (notifications !== undefined) user.preferences.notifications = notifications;
    if (theme) user.preferences.theme = theme;

    await user.save();
    
    res.json({ 
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
};