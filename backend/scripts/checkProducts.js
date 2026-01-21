import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MensShoe from '../models/MensShoe.js';
import WomensShoe from '../models/WomensShoe.js';
import KidsShoe from '../models/KidsShoe.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/shoes';

async function checkProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Check Kids Shoes
    const kidsShoes = await KidsShoe.find({}).limit(5).lean();
    console.log(`Total Kids Shoes: ${await KidsShoe.countDocuments()}`);
    if (kidsShoes.length > 0) {
      console.log('Sample Kids Shoes:');
      kidsShoes.forEach((p, i) => {
        console.log(`${i + 1}. ${p.title} - subCategory: "${p.subCategory}" - rating: ${p.rating || 0}`);
      });
      
      const kidsSubcats = await KidsShoe.distinct('subCategory');
      console.log(`\nKids Shoes subcategories:`, kidsSubcats);
    }

    // Check Men's Shoes
    const mensShoes = await MensShoe.find({}).limit(5).lean();
    console.log(`\nTotal Men's Shoes: ${await MensShoe.countDocuments()}`);
    if (mensShoes.length > 0) {
      console.log("Sample Men's Shoes:");
      mensShoes.forEach((p, i) => {
        console.log(`${i + 1}. ${p.title} - subCategory: "${p.subCategory}" - isFeatured: ${p.isFeatured || false}`);
      });
      
      const mensSubcats = await MensShoe.distinct('subCategory');
      console.log(`\nMen's Shoes subcategories:`, mensSubcats);
    }

    // Check Women's Shoes
    const womensShoes = await WomensShoe.find({}).limit(5).lean();
    console.log(`\nTotal Women's Shoes: ${await WomensShoe.countDocuments()}`);
    if (womensShoes.length > 0) {
      console.log("Sample Women's Shoes:");
      womensShoes.forEach((p, i) => {
        console.log(`${i + 1}. ${p.title} - subCategory: "${p.subCategory}" - isFeatured: ${p.isFeatured || false}`);
      });
      
      const womensSubcats = await WomensShoe.distinct('subCategory');
      console.log(`\nWomen's Shoes subcategories:`, womensSubcats);
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkProducts();
