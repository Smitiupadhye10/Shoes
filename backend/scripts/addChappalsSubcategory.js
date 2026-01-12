import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import WomensShoe from '../models/WomensShoe.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function addChappalsSubcategory() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find products that might need to be updated to Chappals
    // You can modify this query to target specific products
    const productsToUpdate = await WomensShoe.find({
      // Add your criteria here - for example, by title containing "chappal"
      // title: { $regex: /chappal/i }
      // Or update all products in a specific category
    }).limit(10); // Limit to prevent accidental mass updates

    console.log(`\n📊 Found ${productsToUpdate.length} products to potentially update`);
    
    if (productsToUpdate.length === 0) {
      console.log('\n💡 No products found matching your criteria.');
      console.log('   Please modify the query in this script to target specific products.');
      console.log('   Or add new products through the admin panel with subCategory: "Chappals"');
    } else {
      console.log('\n📦 Products found:');
      productsToUpdate.forEach((p, i) => {
        console.log(`${i + 1}. ${p.title} - Current subCategory: "${p.subCategory}"`);
      });
      
      // Uncomment the following to actually update products:
      /*
      const result = await WomensShoe.updateMany(
        { _id: { $in: productsToUpdate.map(p => p._id) } },
        { $set: { subCategory: 'Chappals' } }
      );
      console.log(`\n✅ Updated ${result.modifiedCount} products to subCategory: "Chappals"`);
      */
    }

    // Show current subcategory distribution
    const subCategoryCounts = await WomensShoe.aggregate([
      { $group: { _id: '$subCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Current subCategory distribution:');
    subCategoryCounts.forEach(item => {
      console.log(`   ${item._id}: ${item.count} products`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addChappalsSubcategory();
