import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";

dotenv.config();

// Connect to MongoDB
const connect = async () => {
  try {
    await connectDB();
    return mongoose.connection.db;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

// Active categories that should be kept
const ACTIVE_CATEGORIES = [
  "Men's Shoes",
  "Women's Shoes", 
  "Kids Shoes",
  "Shoes Accessories"
];

// Collections to keep (necessary collections)
const KEEP_COLLECTIONS = [
  "mensshoes",
  "womensshoes", 
  "kidsshoes",
  "shoes_accessories",
  "users",
  "orders",
  "carts",
  "wishlists"
];

// Collections to remove (unwanted/old collections)
const REMOVE_COLLECTIONS = [
  "accesories",      // Old/unused (typo in name)
  "accessories",     // Old/unused
  "bags",            // Old/unused
  "contactlens",     // Old/unused
  "contactlenses",   // Old/unused (plural)
  "products",        // Old/unused (we use specific shoe models now)
  "skincareproducts", // Old/unused
  "skincare",        // Old/unused
  "eyeglasses",      // Old/unused
  "sunglasses"       // Old/unused
];

const analyzeCollections = async () => {
  try {
    const db = await connect();
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    console.log("\n📋 Analyzing MongoDB Collections:");
    console.log("=".repeat(60));
    
    // Analyze each collection
    for (const collectionName of collectionNames) {
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      
      if (count > 0) {
        // Try to get sample documents to check categories
        const sample = await collection.findOne({});
        
        console.log(`\n📦 Collection: ${collectionName}`);
        console.log(`   Documents: ${count}`);
        
        if (sample && sample.category) {
          // Get unique categories in this collection
          const categories = await collection.distinct("category");
          console.log(`   Categories: ${categories.join(", ") || "None"}`);
          
          // Check if categories are active
          const hasInactiveCategories = categories.some(cat => 
            !ACTIVE_CATEGORIES.some(active => 
              cat.toLowerCase().includes(active.toLowerCase()) || 
              active.toLowerCase().includes(cat.toLowerCase())
            )
          );
          
          if (hasInactiveCategories) {
            console.log(`   ⚠️  Contains inactive categories!`);
          }
        }
      } else {
        console.log(`\n📦 Collection: ${collectionName} (empty)`);
      }
    }
    
    // Show what will be kept
    console.log("\n\n✅ Collections to KEEP:");
    KEEP_COLLECTIONS.forEach(name => {
      if (collectionNames.includes(name)) {
        console.log(`   ✅ ${name}`);
      } else {
        console.log(`   ⚠️  ${name} (doesn't exist yet)`);
      }
    });
    
    // Show what will be removed
    console.log("\n\n❌ Collections to REMOVE:");
    const collectionsToRemove = REMOVE_COLLECTIONS.filter(name => 
      collectionNames.includes(name)
    );
    
    if (collectionsToRemove.length === 0) {
      console.log("   ℹ️  No unused collections found to remove.");
    } else {
      for (const name of collectionsToRemove) {
        const collection = db.collection(name);
        const count = await collection.countDocuments();
        console.log(`   ❌ ${name} (${count} documents)`);
      }
    }
    
    // Show unknown collections
    const unknownCollections = collectionNames.filter(name => 
      !KEEP_COLLECTIONS.includes(name) && 
      !REMOVE_COLLECTIONS.includes(name)
    );
    
    if (unknownCollections.length > 0) {
      console.log("\n\n⚠️  Unknown Collections (not in keep/remove lists):");
      unknownCollections.forEach(name => {
        console.log(`   ⚠️  ${name}`);
      });
      console.log("\n   💡 Review these manually before removing!");
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("\n💡 To remove unused collections, run this script with --remove flag");
    console.log("   Example: node scripts/removeUnusedCategories.js --remove\n");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during analysis:", error);
    process.exit(1);
  }
};

const removeUnusedCollections = async () => {
  try {
    const db = await connect();
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    console.log("\n🗑️  Removing unused collections...");
    console.log("=".repeat(60));
    
    let removedCount = 0;
    let totalDocumentsRemoved = 0;
    
    for (const collectionName of REMOVE_COLLECTIONS) {
      if (collectionNames.includes(collectionName)) {
        try {
          const collection = db.collection(collectionName);
          const count = await collection.countDocuments();
          
          if (count > 0) {
            console.log(`\n⚠️  ${collectionName} has ${count} documents.`);
            console.log(`   Deleting collection...`);
            await collection.drop();
            console.log(`   ✅ Dropped collection: ${collectionName} (${count} documents removed)`);
            totalDocumentsRemoved += count;
          } else {
            await collection.drop();
            console.log(`   ✅ Dropped empty collection: ${collectionName}`);
          }
          removedCount++;
        } catch (error) {
          console.error(`   ❌ Error dropping ${collectionName}:`, error.message);
        }
      } else {
        console.log(`   ℹ️  ${collectionName} doesn't exist, skipping`);
      }
    }
    
    // Final summary
    console.log("\n" + "=".repeat(60));
    console.log("\n📊 Cleanup Summary:");
    console.log(`   Collections removed: ${removedCount}`);
    console.log(`   Total documents removed: ${totalDocumentsRemoved}`);
    
    console.log("\n✅ Remaining Collections:");
    const finalCollections = await db.listCollections().toArray();
    finalCollections.forEach(col => {
      const isKeep = KEEP_COLLECTIONS.includes(col.name);
      const status = isKeep ? "✅" : "⚠️";
      console.log(`   ${status} ${col.name}`);
    });
    
    console.log("\n✅ Cleanup complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  }
};

// Check command line arguments
const args = process.argv.slice(2);
const shouldRemove = args.includes("--remove") || args.includes("-r");

if (shouldRemove) {
  console.log("⚠️  WARNING: This will permanently delete unused collections!");
  console.log("⚠️  Make sure you have a backup before proceeding!\n");
  removeUnusedCollections();
} else {
  analyzeCollections();
}
