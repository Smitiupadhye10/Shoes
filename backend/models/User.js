// /backend/server/models/User.js
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  type: { type: String, enum: ['home', 'work', 'other'], required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  isDefault: { type: Boolean, default: false },
  phone: { type: String, required: true },
  name: { type: String, required: true }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { type: String, required: function() { return !this.googleId; }, select: false },
  googleId: { type: String, sparse: true, unique: true },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  phone: { type: String },
  dateOfBirth: { type: Date },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other', 'prefer-not-to-say'] 
  },
  profileImage: { type: String },
  isAdmin: { type: Boolean, default: false },
  addresses: [addressSchema],
  preferences: {
    newsletter: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' }
  },
  lastLogin: { type: Date },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Hash password before saving (only for local auth users)
userSchema.pre('save', async function(next) {
  // Skip password hashing for Google users or if password is not modified
  if (this.provider === 'google' || !this.isModified('password')) return next();
  
  // If password is modified and user is local auth, hash it
  if (this.password && this.provider === 'local') {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name || '';
});

const User = mongoose.model('User', userSchema);

export default User;
