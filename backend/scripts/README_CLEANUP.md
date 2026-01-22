# MongoDB Category Cleanup Scripts

## Overview
These scripts help you safely remove unused categories and collections from your MongoDB database.

## Active Categories
Your application currently uses these categories:
- **Men's Shoes** (collection: `mensshoes`)
- **Women's Shoes** (collection: `womensshoes`)
- **Kids Shoes** (collection: `kidsshoes`)
- **Shoes Accessories** (collection: `shoes_accessories`)

## Collections That Will Be Kept
- `mensshoes`
- `womensshoes`
- `kidsshoes`
- `shoes_accessories`
- `users`
- `orders`
- `carts`
- `wishlists`

## Collections That Will Be Removed
- `accesories` (old/unused)
- `accessories` (old/unused)
- `bags` (old/unused)
- `contactlens` (old/unused)
- `contactlenses` (old/unused)
- `products` (old/unused - replaced by specific shoe models)
- `skincareproducts` (old/unused)
- `skincare` (old/unused)
- `eyeglasses` (old/unused)
- `sunglasses` (old/unused)

## Usage

### Step 1: Analyze Your Database (Safe - Read Only)
First, analyze your database to see what collections exist and what will be removed:

```bash
cd backend
node scripts/removeUnusedCategories.js
```

This will:
- List all collections in your database
- Show document counts for each collection
- Show categories in each collection
- Identify which collections will be kept vs removed
- **This is SAFE - it only reads, doesn't delete anything**

### Step 2: Backup Your Database (IMPORTANT!)
Before removing anything, make sure you have a backup:

```bash
# Using mongodump (if you have MongoDB tools installed)
mongodump --uri="your_mongodb_connection_string" --out=./backup

# Or use MongoDB Atlas backup feature if using Atlas
```

### Step 3: Remove Unused Collections
Once you've reviewed the analysis and created a backup, you can remove unused collections:

```bash
cd backend
node scripts/removeUnusedCategories.js --remove
```

Or use the short flag:
```bash
node scripts/removeUnusedCategories.js -r
```

**⚠️ WARNING: This will permanently delete the collections and all their data!**

## Alternative: Use the Existing Cleanup Script
You can also use the existing cleanup script:

```bash
cd backend
node scripts/cleanupCollections.js
```

## What Happens When You Remove Collections?

1. **Collections are dropped** - All documents in those collections are permanently deleted
2. **No impact on active categories** - Your shoe collections remain untouched
3. **Database size reduced** - Removes unused data and indexes

## Safety Features

- ✅ Analysis mode (default) - Only reads, never deletes
- ✅ Explicit removal flag required - Won't delete without `--remove` flag
- ✅ Shows document counts before deletion
- ✅ Lists what will be kept vs removed
- ✅ Identifies unknown collections for manual review

## Troubleshooting

### "Collection doesn't exist" messages
This is normal - it means those collections were never created or were already removed.

### Unknown collections warning
If you see collections that aren't in the keep/remove lists, review them manually before deciding to remove them.

### Connection errors
Make sure your `.env` file has the correct `MONGODB_URI` configured.

## Need Help?

If you're unsure about removing a collection:
1. Check the analysis output
2. Review the collection manually in MongoDB Compass or Atlas
3. Verify no important data exists in those collections
4. Create a backup before proceeding
