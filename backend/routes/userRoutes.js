// /backend/server/routes/userRoutes.js
import express from 'express';
import { check } from 'express-validator';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  changePassword,
  updatePreferences
} from '../controllers/userController.js';

const userRouter = express.Router();

// Apply verifyToken middleware to all routes
userRouter.use(verifyToken);

// @route   GET /api/users/me
// @desc    Get user profile
// @access  Private
userRouter.get('/me', getProfile);

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
userRouter.put(
  '/me',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail()
  ],
  updateProfile
);

// @route   POST /api/users/addresses
// @desc    Add a new address
// @access  Private
userRouter.post(
  '/addresses',
  [
    check('type', 'Address type is required').isIn(['home', 'work', 'other']),
    check('addressLine1', 'Address line 1 is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    check('state', 'State is required').not().isEmpty(),
    check('postalCode', 'Postal code is required').not().isEmpty(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty()
  ],
  addAddress
);

// @route   PUT /api/users/addresses/:addressId
// @desc    Update an address
// @access  Private
userRouter.put(
  '/addresses/:addressId',
  [
    check('type', 'Invalid address type').optional().isIn(['home', 'work', 'other']),
    check('addressLine1', 'Address line 1 is required').optional().not().isEmpty(),
    check('city', 'City is required').optional().not().isEmpty(),
    check('state', 'State is required').optional().not().isEmpty(),
    check('postalCode', 'Postal code is required').optional().not().isEmpty(),
    check('phone', 'Phone number is required').optional().not().isEmpty(),
    check('name', 'Name is required').optional().not().isEmpty()
  ],
  updateAddress
);

// @route   DELETE /api/users/addresses/:addressId
// @desc    Delete an address
// @access  Private
userRouter.delete('/addresses/:addressId', deleteAddress);

// @route   PUT /api/users/addresses/:addressId/default
// @desc    Set an address as default
// @access  Private
userRouter.put('/addresses/:addressId/default', setDefaultAddress);

// @route   PUT /api/users/change-password
// @desc    Change password
// @access  Private
userRouter.put(
  '/change-password',
  [
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  changePassword
);

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
userRouter.put(
  '/preferences',
  [
    check('theme', 'Invalid theme').optional().isIn(['light', 'dark', 'system']),
    check('newsletter', 'Newsletter preference must be a boolean').optional().isBoolean(),
    check('notifications', 'Notifications preference must be a boolean').optional().isBoolean()
  ],
  updatePreferences
);

export default userRouter;