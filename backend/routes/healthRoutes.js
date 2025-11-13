import express from 'express';
import mongoose from 'mongoose';

const healthRouter = express.Router();

// Health check endpoint
healthRouter.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: {
        status: mongoStatus,
        name: mongoose.connection.name || 'N/A'
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'DOWN',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default healthRouter;
