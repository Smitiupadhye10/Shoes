import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

// Initialize Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

console.log('🔐 Loading auth routes...');
const authRouter = express.Router();
console.log('✅ Auth router created');

// Signin
authRouter.post("/signin", async (req, res) => {
  console.log('🔑 Signin request received:', req.body);
  console.log('📝 Request headers:', req.headers);
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    // Explicitly select password field to ensure it's available
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    console.log('🔍 User found:', user.email);
    console.log('🔍 Has password field:', !!user.password);
    console.log('🔍 Password provided:', !!password);
    
    const isMatch = await user.comparePassword(password);
    console.log('🔍 Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "1h" });
    const displayName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || user.email;
    console.log('✅ Signin successful for:', email);
    res.json({
      token,
      user: {
        id: user._id,
        name: displayName,
        email: user.email,
        isAdmin: user.isAdmin || false
      }
    });
  } catch (error) {
    console.error('❌ Signin error:', error);
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Signup
authRouter.post("/signup", async (req, res) => {
  console.log('👤 Signup request received:', req.body);
  console.log('📝 Request headers:', req.headers);
  try {
    const { email, password, firstName, lastName, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: "User already exists" });
    }
    // Don't hash password here - let the User model's pre-save hook handle it
    const newUser = new User({
      email,
      password: password, // Pass plain password, pre-save hook will hash it
      firstName: firstName || name,
      lastName: lastName || "",
      name: firstName && lastName ? `${firstName} ${lastName}` : name || email
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "1h" });
    const displayName = newUser.firstName && newUser.lastName ? `${newUser.firstName} ${newUser.lastName}` : newUser.name || newUser.email;
    console.log('✅ Signup successful for:', email);
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: displayName,
        email: newUser.email,
        isAdmin: newUser.isAdmin || false
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: "Error signing up", error });
  }
});

// Get current user
authRouter.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("name email firstName lastName isAdmin");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const displayName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || user.email;
    res.json({
      id: user._id,
      name: displayName,
      email: user.email,
      isAdmin: user.isAdmin || false
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Google OAuth Login/Signup
authRouter.post("/google", async (req, res) => {
  console.log('🔑 Google OAuth request received');
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential token is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('❌ GOOGLE_CLIENT_ID not configured');
      return res.status(500).json({ message: "Google OAuth not configured" });
    }

    // Verify the Google ID token
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      console.error('❌ Google token verification failed:', error.message);
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Email not provided by Google" });
    }

    // Find existing user by email or googleId
    let user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { googleId }
      ]
    });

    if (user) {
      // User exists - update Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = 'google';
        if (!user.profileImage && picture) {
          user.profileImage = picture;
        }
        if (!user.name && name) {
          user.name = name;
        }
        user.emailVerified = true;
        await user.save();
      }
    } else {
      // User doesn't exist - create new user
      // Don't include password field - schema validation allows omitting it when googleId is present
      user = new User({
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        googleId,
        provider: 'google',
        profileImage: picture || null,
        emailVerified: true,
      });
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1h" }
    );

    const displayName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.name || user.email;

    console.log('✅ Google OAuth successful for:', email);
    res.json({
      token,
      user: {
        id: user._id,
        name: displayName,
        email: user.email,
        isAdmin: user.isAdmin || false
      }
    });
  } catch (error) {
    console.error('❌ Google OAuth error:', error);
    res.status(500).json({ message: "Error authenticating with Google", error: error.message });
  }
});

// Debug endpoint
authRouter.get("/debug", (req, res) => {
  console.log('🔍 Auth debug route hit!');
  res.json({
    message: "Auth debug working!",
    routes: ["/api/signin (POST)", "/api/signup (POST)", "/api/google (POST)", "/api/me (GET)", "/api/debug (GET)"],
    timestamp: new Date()
  });
});

console.log('📤 Exporting authRouter with', authRouter.stack?.length || 0, 'routes');
export default authRouter;
