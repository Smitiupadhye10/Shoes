# URGENT: Fix Google OAuth 403 Error

## The Error
```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
Failed to load resource: the server responded with a status of 403
```

## What This Means
Google is blocking your OAuth request because your website's URL is **not registered** in Google Cloud Console.

## IMMEDIATE FIX (5 minutes)

### Step 1: Find Your Render Frontend URL
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your **Frontend** service
3. Your URL is shown at the top, something like:
   - `https://your-app-name.onrender.com`
   - Copy this exact URL

### Step 2: Add URL to Google Cloud Console

1. **Open Google Cloud Console:**
   - Go to: https://console.cloud.google.com/
   - Make sure you're in the correct project

2. **Navigate to Credentials:**
   - Click on "APIs & Services" in the left menu
   - Click on "Credentials"

3. **Edit Your OAuth Client ID:**
   - Find the OAuth 2.0 Client ID that matches your Client ID:
     `230208194801-qqqh5gbqltoa96k1g46i10h823s4t09r.apps.googleusercontent.com`
   - Click on it to edit

4. **Add Authorized JavaScript Origin:**
   - Scroll down to "Authorized JavaScript origins"
   - Click the **"+ ADD URI"** button
   - Paste your Render URL: `https://your-app-name.onrender.com`
   - ⚠️ **IMPORTANT CHECKS:**
     - Must start with `https://` (NOT `http://`)
     - NO trailing slash (NOT `https://your-app.onrender.com/`)
     - Use your FRONTEND URL (not backend)

5. **Save:**
   - Click "SAVE" at the bottom
   - Wait 2-5 minutes for changes to propagate

### Step 3: Test

1. Go back to your Render app
2. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
3. Try clicking "Continue with Google" button
4. It should now work!

## Current Authorized Origins Should Include:

```
http://localhost:5173
https://your-app-name.onrender.com    ← ADD THIS ONE!
```

## Common Mistakes (Check These!)

❌ **WRONG:** `http://your-app.onrender.com` (missing 's' in https)  
✅ **CORRECT:** `https://your-app.onrender.com`

❌ **WRONG:** `https://your-app.onrender.com/` (trailing slash)  
✅ **CORRECT:** `https://your-app.onrender.com`

❌ **WRONG:** Adding backend URL instead of frontend URL  
✅ **CORRECT:** Add the URL where users visit your website

❌ **WRONG:** Forgetting to click SAVE  
✅ **CORRECT:** Always click SAVE after adding

## Still Not Working?

1. **Double-check the URL matches exactly** (copy-paste from Render dashboard)
2. **Wait 5 minutes** - Google needs time to propagate changes
3. **Clear browser cache** or try incognito mode
4. **Check browser console** for any other errors
5. **Verify Client ID matches** in both Google Console and Render environment variables

## Need Help Finding Your URL?

1. In Render Dashboard, your frontend service URL is shown at the top
2. Or check the "Settings" tab for "Auto-Deploy URL"
3. It should look like: `https://something.onrender.com`

