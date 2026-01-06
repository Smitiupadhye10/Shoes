import mongoose from 'mongoose';
export const connectDB = async() => {
    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI not found in environment variables');
        process.exit(1);
    }
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => {
        console.error('❌ MongoDB connection failed:', err.message);
        console.error('Check your MONGO_URI in .env file');
        process.exit(1);
    });
}
