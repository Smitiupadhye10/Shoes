import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MensShoe from '../models/MensShoe.js';
import WomensShoe from '../models/WomensShoe.js';
import KidsShoe from '../models/KidsShoe.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/shoes';

async function checkProductStructure() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Check one Kids Shoe product
    const kidsProduct = await KidsShoe.findOne({}).lean();
    if (kidsProduct) {
      console.log('Kids Shoe Product Structure:');
      console.log(JSON.stringify(kidsProduct, null, 2));
    }

    // Check one Men's Shoe product
    const mensProduct = await MensShoe.findOne({}).lean();
    if (mensProduct) {
      console.log('\n\nMen\'s Shoe Product Structure:');
      console.log(JSON.stringify(mensProduct, null, 2));
    }

    // Check one Women's Shoe product
    const womensProduct = await WomensShoe.findOne({}).lean();
    if (womensProduct) {
      console.log('\n\nWomen\'s Shoe Product Structure:');
      console.log(JSON.stringify(womensProduct, null, 2));
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkProductStructure();
