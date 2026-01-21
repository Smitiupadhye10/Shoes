import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import MensShoe from '../models/MensShoe.js';
import WomensShoe from '../models/WomensShoe.js';
import KidsShoe from '../models/KidsShoe.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function addRatingsAndBestSellers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Helper function to generate random rating between 3.5 and 5.0
    const getRandomRating = () => {
      return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10; // 3.5 to 5.0
    };

    // Helper function to generate random review count
    const getRandomReviews = () => {
      return Math.floor(Math.random() * 50) + 5; // 5 to 54 reviews
    };

    // Update ALL Kids Shoes (add ratings and mark some as best sellers)
    console.log('📦 Updating ALL Kids Shoes...');
    const allKidsShoes = await KidsShoe.find({});
    console.log(`Found ${allKidsShoes.length} total Kids Shoes products`);
    
    let kidsBestSellerCount = 0;
    let kidsUpdated = 0;
    
    for (let i = 0; i < allKidsShoes.length; i++) {
      const product = allKidsShoes[i];
      const rating = getRandomRating();
      const reviewsCount = getRandomReviews();
      
      // Mark approximately 30% as best sellers
      const shouldBeBestSeller = i % 3 === 0 || Math.random() < 0.3;
      
      const updateData = {
        rating: rating,
        ratingsCount: Math.floor(reviewsCount * 0.8),
        reviewsCount: reviewsCount,
      };
      
      if (shouldBeBestSeller) {
        updateData.isFeatured = true;
        updateData.onSale = Math.random() < 0.5;
        kidsBestSellerCount++;
      }
      
      await KidsShoe.updateOne(
        { _id: product._id },
        { $set: updateData }
      );
      
      kidsUpdated++;
      if (kidsUpdated % 100 === 0) {
        console.log(`   Updated ${kidsUpdated}/${allKidsShoes.length} products...`);
      }
    }
    console.log(`✅ Updated ${kidsUpdated} Kids Shoes products with ratings`);
    console.log(`⭐ Marked ${kidsBestSellerCount} Kids Shoes products as best sellers\n`);

    // Update Men's Shoes - mark some products as best sellers
    console.log('👔 Updating Men\'s Shoes...');
    const allMensShoes = await MensShoe.find({});
    console.log(`Found ${allMensShoes.length} total Men's Shoes products`);
    
    let mensBestSellerCount = 0;
    let mensUpdated = 0;
    
    for (let i = 0; i < allMensShoes.length; i++) {
      const product = allMensShoes[i];
      // Mark approximately 25-30% as best sellers
      const shouldBeBestSeller = i % 4 === 0 || Math.random() < 0.25;
      
      if (shouldBeBestSeller && !product.isFeatured) {
        await MensShoe.updateOne(
          { _id: product._id },
          {
            $set: {
              isFeatured: true,
              onSale: Math.random() < 0.4,
            }
          }
        );
        mensBestSellerCount++;
      }
      mensUpdated++;
      if (mensUpdated % 100 === 0) {
        console.log(`   Processed ${mensUpdated}/${allMensShoes.length} products...`);
      }
    }
    console.log(`⭐ Marked ${mensBestSellerCount} Men's Shoes products as best sellers\n`);

    // Update Women's Shoes - mark some products as best sellers
    console.log('👠 Updating Women\'s Shoes...');
    const allWomensShoes = await WomensShoe.find({});
    console.log(`Found ${allWomensShoes.length} total Women's Shoes products`);
    
    let womensBestSellerCount = 0;
    let womensUpdated = 0;
    
    for (let i = 0; i < allWomensShoes.length; i++) {
      const product = allWomensShoes[i];
      // Mark approximately 25-30% as best sellers (but don't override existing)
      const shouldBeBestSeller = i % 4 === 0 || Math.random() < 0.25;
      
      if (shouldBeBestSeller && !product.isFeatured) {
        await WomensShoe.updateOne(
          { _id: product._id },
          {
            $set: {
              isFeatured: true,
              onSale: Math.random() < 0.4,
            }
          }
        );
        womensBestSellerCount++;
      }
      womensUpdated++;
      if (womensUpdated % 100 === 0) {
        console.log(`   Processed ${womensUpdated}/${allWomensShoes.length} products...`);
      }
    }
    console.log(`⭐ Marked ${womensBestSellerCount} Women's Shoes products as best sellers\n`);

    console.log('✅ All updates completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Kids Shoes: ${kidsUpdated} updated with ratings, ${kidsBestSellerCount} best sellers`);
    console.log(`   - Men's Shoes: ${mensBestSellerCount} best sellers`);
    console.log(`   - Women's Shoes: ${womensBestSellerCount} best sellers`);

  } catch (error) {
    console.error('❌ Error updating products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

addRatingsAndBestSellers();
