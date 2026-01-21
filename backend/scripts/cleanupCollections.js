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

// Collections to keep (necessary collections)
const KEEP_COLLECTIONS = [
  "mensshoes",
  "womensshoes", 
  "kidsshoes",
  "shoes_accessories", // Will be created when first document is inserted
  "users",
  "orders",
  "carts",
  "wishlists"
];

// Collections to remove (unwanted/old collections)
const REMOVE_COLLECTIONS = [
  "accesories",      // Old/unused
  "bags",            // Old/unused
  "contactlens",     // Old/unused
  "products",        // Old/unused (we use specific shoe models now)
  "skincareproducts" // Old/unused
];

const cleanupCollections = async () => {
  try {
    const db = await connect();
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    console.log("\n📋 Current Collections:");
    collectionNames.forEach(name => {
      const isKeep = KEEP_COLLECTIONS.includes(name);
      const isRemove = REMOVE_COLLECTIONS.includes(name);
      const status = isKeep ? "✅ KEEP" : isRemove ? "❌ REMOVE" : "⚠️  UNKNOWN";
      console.log(`  ${status} - ${name}`);
    });
    
    // Remove unwanted collections
    console.log("\n🗑️  Removing unwanted collections...");
    for (const collectionName of REMOVE_COLLECTIONS) {
      if (collectionNames.includes(collectionName)) {
        try {
          const collection = db.collection(collectionName);
          const count = await collection.countDocuments();
          
          if (count > 0) {
            console.log(`  ⚠️  ${collectionName} has ${count} documents. Deleting...`);
            await collection.drop();
            console.log(`  ✅ Dropped collection: ${collectionName} (${count} documents removed)`);
          } else {
            await collection.drop();
            console.log(`  ✅ Dropped empty collection: ${collectionName}`);
          }
        } catch (error) {
          console.error(`  ❌ Error dropping ${collectionName}:`, error.message);
        }
      } else {
        console.log(`  ℹ️  Collection ${collectionName} doesn't exist, skipping`);
      }
    }
    
    // Check for shoes_accessories collection
    console.log("\n🔍 Checking shoes_accessories collection...");
    if (collectionNames.includes("shoes_accessories")) {
      const count = await db.collection("shoes_accessories").countDocuments();
      console.log(`  ✅ shoes_accessories exists with ${count} documents`);
    } else {
      console.log(`  ℹ️  shoes_accessories doesn't exist yet (will be created when first document is inserted)`);
    }
    
    // Final summary
    console.log("\n📊 Final Collections:");
    const finalCollections = await db.listCollections().toArray();
    finalCollections.forEach(col => {
      console.log(`  ✅ ${col.name}`);
    });
    
    console.log("\n✅ Cleanup complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  }
};

// Run the cleanup
cleanupCollections();
