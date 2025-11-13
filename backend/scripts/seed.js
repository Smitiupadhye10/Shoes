import mongoose from 'mongoose';
import faker from 'faker';
import dotenv from 'dotenv';
import ContactLens from './models/ContactLens.js';

dotenv.config();

async function main() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/lenslogic';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✅ MongoDB connected');

  const BRANDS = ['Bausch & Lomb', 'Acuvue', 'Alcon', 'CooperVision', 'FreshLook'];
  const LENS_TYPES = ['Soft', 'Rigid Gas Permeable', 'Hybrid', 'Daily Disposable', 'Extended Wear'];
  const USAGE = ['Daily', 'Monthly', 'Yearly'];
  const MATERIALS = ['Etafilcon A', 'Nelfilcon A', 'Senofilcon A', 'Lotrafilcon A', 'Comfilcon A'];
  const COLORS = ['Clear', 'Blue', 'Green', 'Brown', 'Gray', 'Hazel', 'Violet', 'Amethyst'];
  const SUB_SUB = ['Spherical', 'Toric', 'Multifocal'];
  const WARRANTIES = ['6 Months', '1 Year', '2 Years'];

  const makeImages = () => {
    const base = 'https://res.cloudinary.com/dfhjtmvrz/image/upload/';
    const ts = faker.datatype.number({ min: 1700000000, max: 1800000000 });
    const id = faker.random.alphaNumeric(10);
    return [
      `${base}v${ts}/${id}_front.jpg`,
      `${base}v${ts}/${id}_box.jpg`,
      `${base}v${ts}/${id}_detail.jpg`,
    ];
  };

  const makeTitle = (i) => {
    const brand = faker.random.arrayElement(BRANDS);
    const usage = faker.random.arrayElement(USAGE);
    const lensType = faker.random.arrayElement(LENS_TYPES);
    return `${brand} ${usage} ${lensType} Contact Lenses - Model ${i + 1}`;
  };

  const docs = [];
  for (let i = 0; i < 100; i++) {
    const brand = faker.random.arrayElement(BRANDS);
    const usageDuration = faker.random.arrayElement(USAGE);
    const lensType = faker.random.arrayElement(LENS_TYPES);
    const material = faker.random.arrayElement(MATERIALS);
    const color = faker.random.arrayElement(COLORS);
    const subSubCategory = faker.random.arrayElement(SUB_SUB);

    docs.push({
      title: makeTitle(i),
      price: faker.datatype.number({ min: 300, max: 5000 }),
      description: faker.lorem.sentence(),
      category: 'Contact Lenses',
      subCategory: usageDuration,
      subSubCategory,
      product_info: {
        brand,
        lensType,
        usageDuration,
        material,
        packaging: `${faker.datatype.number({ min: 30, max: 90 })} lenses`,
        color,
        waterContent: faker.datatype.number({ min: 30, max: 60 }),
        powerRange: '-0.50 to -6.00',
        baseCurve: faker.datatype.number({ min: 8.0, max: 9.5, precision: 0.1 }),
        diameter: faker.datatype.number({ min: 13.8, max: 15.0, precision: 0.1 }),
        warranty: faker.random.arrayElement(WARRANTIES),
      },
      images: makeImages(),
      ratings: parseFloat(faker.datatype.float({ min: 3.5, max: 5.0, precision: 0.1 }).toFixed(1)),
      discount: faker.datatype.number({ min: 0, max: 50 }),
    });
  }

  console.log(`🌱 Prepared ${docs.length} contact lenses to insert`);

  // Insert without deleting existing data; continue on duplicate titles
  const result = await ContactLens.insertMany(docs, { ordered: false }).catch((e) => {
    console.warn('⚠️ Some inserts may have failed (duplicates, etc.):', e?.writeErrors?.length || e?.message || e);
    return [];
  });

  const total = await ContactLens.countDocuments();
  console.log(`🎉 Inserted ${Array.isArray(result) ? result.length : 0} docs. Total ContactLens docs now: ${total}`);

  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
}

main().catch(async (err) => {
  console.error('❌ Seeder error:', err?.message || err);
  try { await mongoose.connection.close(); } catch {}
  process.exit(1);
});

// dotenv.config();

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lenslogic', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Categories and their data
// const categories = ['eyeglasses', 'computer glasses', 'sunglasses'];

// const brands = ['RayBan', 'Oakley', 'Titan', 'Fastrack', 'Vincent Chase', 'Vogue Eyewear', 'Emporio Armani', 'Burberry', 'Maui Jim'];
// const genders = ['Men', 'Women', 'Unisex', 'Kids'];
// const sizes = ['Small', 'Medium', 'Large', 'Universal'];
// const frameShapes = ['Rectangle', 'Round', 'Cat Eye', 'Aviator', 'Wayfarer', 'Geometric', 'Wraparound', 'Square', 'Oval'];
// const frameMaterials = ['Acetate', 'Metal', 'Titanium', 'Plastic', 'Wood', 'Carbon Fiber', 'Stainless Steel', 'Polycarbonate'];
// const frameColors = ['Black', 'Brown', 'Blue', 'Gray', 'Silver', 'Gold', 'Red', 'Green', 'Pink', 'Purple', 'Tortoise', 'Clear', 'Mirrored', 'Gradient'];
// const rimTypes = ['Full Rim', 'Half Rim', 'Rimless', 'Semi-Rimless'];
// const warranties = ['1 Year', '2 Years', '3 Years', 'Lifetime Warranty'];

// // Helper function to generate unique title
// const generateTitle = (category, index) => {
//   const adjectives = ['Premium', 'Classic', 'Modern', 'Stylish', 'Elegant', 'Sport', 'Designer', 'Luxury', 'Casual', 'Professional', 'Advanced', 'Comfort', 'Lightweight', 'Durable'];
//   const materials = ['Titanium', 'Acetate', 'Metal', 'Plastic', 'Wood', 'Carbon Fiber', 'Polycarbonate'];
  
//   const adjective = faker.random.arrayElement(adjectives);
//   const material = faker.random.arrayElement(materials);
//   const brand = faker.random.arrayElement(brands);
//   const shape = faker.random.arrayElement(frameShapes);
  
//   // Capitalize first letter of category
//   const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  
//   return `${adjective} ${brand} ${shape} ${material} ${categoryName} - Model ${index + 1}`;
// };

// // Helper function to generate price based on distribution
// const generatePrice = (index) => {
//   // 1000 products (50%) in range 300-1000
//   if (index < 1000) {
//     return faker.datatype.number({ min: 300, max: 1000 });
//   }
//   // 600 products (30%) in range 1000-5000
//   else if (index < 1600) {
//     return faker.datatype.number({ min: 1000, max: 5000 });
//   }
//   // 400 products (20%) in range 5000-10000
//   else {
//     return faker.datatype.number({ min: 5000, max: 10000 });
//   }
// };

// // Helper function to generate images
// const generateImages = () => {
//   const baseUrl = 'https://res.cloudinary.com/dfhjtmvrz/image/upload/';
//   const timestamp = faker.datatype.number({ min: 1700000000, max: 1800000000 });
//   const productId = faker.random.alphaNumeric(10);
  
//   return [
//     `${baseUrl}v${timestamp}/${productId}_front.jpg`,
//     `${baseUrl}v${timestamp}/${productId}_side.jpg`,
//     `${baseUrl}v${timestamp}/${productId}_detail.jpg`
//   ];
// };

// // Helper function to generate product info
// const generateProductInfo = (category) => {
//   const productInfo = {
//     brand: faker.random.arrayElement(brands),
//     gender: faker.random.arrayElement(genders),
//     size: faker.random.arrayElement(sizes),
//     frameShape: faker.random.arrayElement(frameShapes),
//     frameMaterial: faker.random.arrayElement(frameMaterials),
//     frameColor: faker.random.arrayElement(frameColors),
//     rimDetails: faker.random.arrayElement(rimTypes),
//     warranty: faker.random.arrayElement(warranties),
//   };
  
//   // Add specific features for computer glasses
//   if (category === 'computer glasses') {
//     productInfo.blueLightProtection = 'Yes';
//     productInfo.antiGlare = 'Yes';
//     productInfo.usage = 'Computer Work';
//   }
  
//   // Add specific features for sunglasses
//   if (category === 'sunglasses') {
//     productInfo.uvProtection = 'UV400';
//     productInfo.polarization = faker.random.arrayElement(['Yes', 'No']);
//   }
  
//   return productInfo;
// };

// // Helper function to generate description
// const generateDescription = (category, brand, shape) => {
//   const benefits = [
//     'Superior comfort for all-day wear',
//     'Lightweight design for maximum comfort',
//     'Durable construction for long-lasting use',
//     'Stylish appearance for any occasion',
//     'Advanced lens technology for optimal vision',
//     'Perfect blend of style and functionality',
//     'Professional grade optical quality',
//     'Ergonomic design for perfect fit'
//   ];
  
//   const features = [
//     `High-quality ${faker.random.arrayElement(['acetate', 'metal', 'titanium', 'plastic'])} frame`,
//     `${shape} design for versatile styling`,
//     'Scratch-resistant lenses',
//     'UV protection coating',
//     'Anti-glare technology',
//     'Comfortable nose pads',
//     'Flexible temples',
//     'Secure fit design'
//   ];
  
//   const useCases = category === 'computer glasses' 
//     ? ['extended screen time', 'office work', 'gaming sessions', 'digital device usage']
//     : ['daily wear', 'outdoor activities', 'special occasions', 'sports activities'];
  
//   return `Experience ${faker.random.arrayElement(benefits).toLowerCase()} with these premium ${category}. Features include ${faker.random.arrayElement(features).toLowerCase()}, ${faker.random.arrayElement(features).toLowerCase()}, and ${faker.random.arrayElement(features).toLowerCase()}. Perfect for ${faker.random.arrayElement(useCases)}. Designed by ${brand} for exceptional quality and style.`;
// };

// // Generate products array
// let products = [];

// console.log('🌱 Starting to generate 2000 products...');

// // Generate products
// for (let i = 0; i < 3000; i++) {
//   const category = faker.random.arrayElement(categories);
  
//   let product;
  
//   if (category === 'contact lenses') {
//     // Generate contact lens with different schema
//     const contactBrands = ['Bausch & Lomb', 'Acuvue', 'Alcon'];
//     const lensTypes = ['Soft', 'Rigid Gas Permeable', 'Hybrid', 'Daily Disposable', 'Extended Wear'];
//     const disposability = ['Daily', 'Monthly', 'Yearly'];
//     const materials = ['Etafilcon A', 'Nelfilcon A', 'Senofilcon A', 'Lotrafilcon A', 'Comfilcon A'];
//     const colors = ['Clear', 'Blue', 'Green', 'Brown', 'Gray', 'Hazel', 'Violet', 'Amethyst'];
    
//     product = {
//       title: `Premium ${faker.random.arrayElement(contactBrands)} ${faker.random.arrayElement(disposability)} Contact Lenses - Model ${i + 1}`,
//       price: generatePrice(i),
//       description: faker.lorem.paragraph(),
//       category: category,
//       subCategory: faker.random.arrayElement(disposability),
//       subSubCategory: faker.random.arrayElement(['Spherical', 'Toric', 'Multifocal']),
//       product_info: {
//         brand: faker.random.arrayElement(contactBrands),
//         lensType: faker.random.arrayElement(lensTypes),
//         usageDuration: faker.random.arrayElement(disposability),
//         material: faker.random.arrayElement(materials),
//         packaging: `${faker.datatype.number({ min: 30, max: 90 })} lenses`,
//         color: faker.random.arrayElement(colors),
//         waterContent: faker.datatype.number({ min: 30, max: 60 }),
//         powerRange: '-0.50 to -6.00',
//         baseCurve: faker.datatype.number({ min: 8.0, max: 9.5, precision: 0.1 }),
//         diameter: faker.datatype.number({ min: 13.8, max: 15.0, precision: 0.1 }),
//         warranty: faker.random.arrayElement(warranties),
//       },
//       images: generateImages(),
//       ratings: parseFloat(faker.datatype.float({ min: 3.5, max: 5.0, precision: 0.1 }).toFixed(1)),
//       discount: faker.datatype.number({ min: 0, max: 50 })
//     };
//   } else {
//     // Generate regular eyewear product
//     product = {
//       title: generateTitle(category, i),
//       price: generatePrice(i),
//       description: faker.lorem.paragraph(),
//       category: category,
//       subCategory: faker.random.arrayElement(genders),
//       subSubCategory: faker.random.arrayElement(['Classic', 'Sport', 'Designer', 'Casual']),
//       product_info: {
//         brand: faker.random.arrayElement(brands),
//         gender: faker.random.arrayElement(genders),
//         size: faker.random.arrayElement(sizes),
//         frameShape: faker.random.arrayElement(frameShapes),
//         frameMaterial: faker.random.arrayElement(frameMaterials),
//         frameColor: faker.random.arrayElement(frameColors),
//         rimDetails: faker.random.arrayElement(rimTypes),
//         warranty: faker.random.arrayElement(warranties),
//       },
//       images: generateImages(),
//       ratings: parseFloat(faker.datatype.float({ min: 3.5, max: 5.0, precision: 0.1 }).toFixed(1)),
//       discount: faker.datatype.number({ min: 0, max: 50 })
//     };
//   }
  
//   products.push(product);
  
//   // Progress indicator
//   if ((i + 1) % 200 === 0) {
//     console.log(`Generated ${i + 1} products...`);
//   }
// }

// console.log(`✅ Generated ${products.length} products in memory`);
// console.log('📊 Product distribution:');
// console.log(`👓 Eyeglasses: ${products.filter(p => p.category === 'Eyeglasses').length}`);
// console.log(`🕶️ Sunglasses: ${products.filter(p => p.category === 'Sunglasses').length}`);
// console.log(`💻 Computer Glasses: ${products.filter(p => p.category === 'Computer glasses').length}`);

// // Show sample product
// console.log('\n📋 Sample product:');
// console.log(JSON.stringify(products[0], null, 2));

// // Function to save products to database
// const saveProducts = async () => {
//   try {
//     console.log('💾 Saving products to database...');
    
//     // Clear existing data
//     await Product.deleteMany({});
//     console.log('🗑️ Cleared existing products');
    
//     // Insert products in batches to avoid memory issues
//     const batchSize = 100;
//     for (let i = 0; i < products.length; i += batchSize) {
//       const batch = products.slice(i, i + batchSize);
//       await Product.insertMany(batch);
//       console.log(`💾 Saved batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(products.length/batchSize)}`);
//     }
    
//     const finalCount = await Product.countDocuments();
//     console.log('🎉 Database seeded successfully!');
//     console.log(`📊 New products added: ${products.length}`);
//     console.log(`📊 Total products in database: ${finalCount}`);
    
//     // Price distribution analysis
//     const priceRanges = {
//       '300-1000': products.filter(p => p.price >= 300 && p.price <= 1000).length,
//       '1000-5000': products.filter(p => p.price > 1000 && p.price <= 5000).length,
//       '5000-10000': products.filter(p => p.price > 5000 && p.price <= 10000).length
//     };
    
//     console.log('💰 Price distribution:');
//     Object.entries(priceRanges).forEach(([range, count]) => {
//       const percentage = ((count / products.length) * 100).toFixed(1);
//       console.log(`   ${range}: ${count} products (${percentage}%)`);
//     });
    
//   } catch (error) {
//     console.error('❌ Error saving products:', error);
//   } finally {
//     mongoose.connection.close();
//     console.log('🔌 Database connection closed');
//   }
// };

// // Save products to database
// saveProducts();