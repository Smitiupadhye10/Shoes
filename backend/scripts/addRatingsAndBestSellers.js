import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MensShoe from '../models/MensShoe.js';
import WomensShoe from '../models/WomensShoe.js';
import KidsShoe from '../models/KidsShoe.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shoes';

async function addRatingsAndBestSellers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Helper function to generate random rating between 3.5 and 5.0
    const getRandomRating = () => {
      return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10; // 3.5 to 5.0
    };

    // Helper function to generate random review count
    const getRandomReviews = () => {
      return Math.floor(Math.random() * 50) + 5; // 5 to 54 reviews
    };

    // Update Kids Shoes - Boys Footwear (add ratings and mark some as best sellers)
    console.log('\n📦 Updating Kids Shoes - Boys Footwear...');
    const boysFootwear = await KidsShoe.find({ subCategory: "Boys Footwear" });
    console.log(`Found ${boysFootwear.length} Boys Footwear products`);
    
    let boysBestSellerCount = 0;
    for (let i = 0; i < boysFootwear.length; i++) {
      const product = boysFootwear[i];
      const rating = getRandomRating();
      const reviewsCount = getRandomReviews();
      
      // Mark approximately 30% as best sellers
      const shouldBeBestSeller = i % 3 === 0 || Math.random() < 0.3;
      
      await KidsShoe.updateOne(
        { _id: product._id },
        {
          $set: {
            rating: rating,
            ratingsCount: Math.floor(reviewsCount * 0.8), // ratingsCount is usually less than reviewsCount
            reviewsCount: reviewsCount,
            isFeatured: shouldBeBestSeller,
            onSale: shouldBeBestSeller && Math.random() < 0.5, // Some best sellers are also on sale
          }
        }
      );
      
      if (shouldBeBestSeller) {
        boysBestSellerCount++;
      }
    }
    console.log(`✅ Updated ${boysFootwear.length} Boys Footwear products with ratings`);
    console.log(`⭐ Marked ${boysBestSellerCount} Boys Footwear products as best sellers`);

    // Update Kids Shoes - Girls Footwear (add ratings and mark some as best sellers)
    console.log('\n📦 Updating Kids Shoes - Girls Footwear...');
    const girlsFootwear = await KidsShoe.find({ subCategory: "Girls Footwear" });
    console.log(`Found ${girlsFootwear.length} Girls Footwear products`);
    
    let girlsBestSellerCount = 0;
    for (let i = 0; i < girlsFootwear.length; i++) {
      const product = girlsFootwear[i];
      const rating = getRandomRating();
      const reviewsCount = getRandomReviews();
      
      // Mark approximately 30% as best sellers
      const shouldBeBestSeller = i % 3 === 0 || Math.random() < 0.3;
      
      await KidsShoe.updateOne(
        { _id: product._id },
        {
          $set: {
            rating: rating,
            ratingsCount: Math.floor(reviewsCount * 0.8),
            reviewsCount: reviewsCount,
            isFeatured: shouldBeBestSeller,
            onSale: shouldBeBestSeller && Math.random() < 0.5,
          }
        }
      );
      
      if (shouldBeBestSeller) {
        girlsBestSellerCount++;
      }
    }
    console.log(`✅ Updated ${girlsFootwear.length} Girls Footwear products with ratings`);
    console.log(`⭐ Marked ${girlsBestSellerCount} Girls Footwear products as best sellers`);

    // Update Men's Shoes - mark some products as best sellers across all subcategories
    console.log('\n👔 Updating Men\'s Shoes...');
    const mensSubcategories = await MensShoe.distinct('subCategory');
    console.log(`Found subcategories: ${mensSubcategories.join(', ')}`);
    let mensBestSellerCount = 0;
    
    for (const subCat of mensSubcategories) {
      const products = await MensShoe.find({ subCategory: subCat });
      console.log(`Found ${products.length} ${subCat} products`);
      
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        // Mark approximately 25-30% as best sellers
        const shouldBeBestSeller = i % 4 === 0 || Math.random() < 0.25;
        
        if (shouldBeBestSeller) {
          await MensShoe.updateOne(
            { _id: product._id },
            {
              $set: {
                isFeatured: true,
                onSale: Math.random() < 0.4, // Some are on sale
              }
            }
          );
          mensBestSellerCount++;
        }
      }
    }
    console.log(`⭐ Marked ${mensBestSellerCount} Men's Shoes products as best sellers`);

    // Update Women's Shoes - mark some products as best sellers across all subcategories
    console.log('\n👠 Updating Women\'s Shoes...');
    const womensSubcategories = await WomensShoe.distinct('subCategory');
    console.log(`Found subcategories: ${womensSubcategories.join(', ')}`);
    let womensBestSellerCount = 0;
    
    for (const subCat of womensSubcategories) {
      const products = await WomensShoe.find({ subCategory: subCat });
      console.log(`Found ${products.length} ${subCat} products`);
      
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        // Mark approximately 25-30% as best sellers
        const shouldBeBestSeller = i % 4 === 0 || Math.random() < 0.25;
        
        if (shouldBeBestSeller) {
          await WomensShoe.updateOne(
            { _id: product._id },
            {
              $set: {
                isFeatured: true,
                onSale: Math.random() < 0.4, // Some are on sale
              }
            }
          );
          womensBestSellerCount++;
        }
      }
    }
    console.log(`⭐ Marked ${womensBestSellerCount} Women's Shoes products as best sellers`);

    console.log('\n✅ All updates completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Kids Boys Footwear: ${boysBestSellerCount} best sellers`);
    console.log(`   - Kids Girls Footwear: ${girlsBestSellerCount} best sellers`);
    console.log(`   - Men's Shoes: ${mensBestSellerCount} best sellers`);
    console.log(`   - Women's Shoes: ${womensBestSellerCount} best sellers`);

  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
}

addRatingsAndBestSellers();
