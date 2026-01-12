import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import WomensShoe from '../models/WomensShoe.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkChappals() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all products with subCategory containing "chappal" (case-insensitive)
    const allProducts = await WomensShoe.find({}).lean();
    console.log(`\n📊 Total Women's Shoes products: ${allProducts.length}`);

    // Check subcategories
    const subCategories = [...new Set(allProducts.map(p => p.subCategory))];
    console.log(`\n📋 Unique subCategories found:`, subCategories);

    // Find products with chappals (case-insensitive search)
    const chappalsProducts = await WomensShoe.find({
      subCategory: { $regex: /chappal/i }
    }).lean();
    
    console.log(`\n🔍 Products with "chappal" in subCategory: ${chappalsProducts.length}`);
    
    if (chappalsProducts.length > 0) {
      console.log('\n📦 Chappals Products:');
      chappalsProducts.forEach((p, i) => {
        console.log(`\n${i + 1}. Title: ${p.title}`);
        console.log(`   subCategory: "${p.subCategory}"`);
        console.log(`   category: "${p.category}"`);
        console.log(`   _id: ${p._id}`);
        console.log(`   inStock: ${p.inStock}`);
      });
    } else {
      console.log('\n❌ No products found with "chappal" in subCategory');
      console.log('\n💡 Make sure products are saved with subCategory: "Chappals" (capital C)');
    }

    // Check exact match for "Chappals"
    const exactChappals = await WomensShoe.find({
      subCategory: "Chappals"
    }).lean();
    console.log(`\n✅ Products with exact subCategory "Chappals": ${exactChappals.length}`);

    // Check case-insensitive match
    const caseInsensitiveChappals = await WomensShoe.find({
      subCategory: { $regex: /^chappals$/i }
    }).lean();
    console.log(`\n✅ Products with case-insensitive "chappals": ${caseInsensitiveChappals.length}`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkChappals();
