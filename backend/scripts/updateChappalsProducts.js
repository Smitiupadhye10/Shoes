import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import WomensShoe from '../models/WomensShoe.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function updateChappalsProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find products with "chappal" in title that are currently categorized as "Sandals"
    const chappalsProducts = await WomensShoe.find({
      $or: [
        { title: { $regex: /chappal/i } },
        { description: { $regex: /chappal/i } }
      ],
      subCategory: { $in: ['Sandals', 'sandals'] }
    }).lean();

    console.log(`\n📊 Found ${chappalsProducts.length} products to update from "Sandals" to "Chappals"`);
    
    if (chappalsProducts.length > 0) {
      console.log('\n📦 Products to be updated:');
      chappalsProducts.forEach((p, i) => {
        console.log(`${i + 1}. "${p.title}" - Current: "${p.subCategory}" → New: "Chappals"`);
      });

      // Update the products
      const result = await WomensShoe.updateMany(
        {
          $or: [
            { title: { $regex: /chappal/i } },
            { description: { $regex: /chappal/i } }
          ],
          subCategory: { $in: ['Sandals', 'sandals'] }
        },
        { $set: { subCategory: 'Chappals' } }
      );

      console.log(`\n✅ Successfully updated ${result.modifiedCount} products to subCategory: "Chappals"`);

      // Verify the update
      const updatedProducts = await WomensShoe.find({
        subCategory: 'Chappals'
      }).lean();
      
      console.log(`\n✅ Verification: Found ${updatedProducts.length} products with subCategory: "Chappals"`);
    } else {
      console.log('\n💡 No products found that need updating.');
      console.log('   Make sure products with "chappal" in the title have subCategory: "Chappals"');
    }

    // Show updated subcategory distribution
    const subCategoryCounts = await WomensShoe.aggregate([
      { $group: { _id: '$subCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Updated subCategory distribution:');
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

updateChappalsProducts();
