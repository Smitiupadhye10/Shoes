# Fix Google OAuth 403 Error: "The given origin is not allowed"

## Error Message
```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
Failed to load resource: the server responded with a status of 403
```

## Problem
Google is blocking the OAuth request because your Render production URL is not in the **Authorized JavaScript origins** list in Google Cloud Console.

## Solution: Add Your Render URL to Google Cloud Console

### Step 1: Get Your Render Frontend URL
Your Render frontend URL should look like:
- `https://your-app-name.onrender.com`

### Step 2: Add to Google Cloud Console

1. **Go to Google Cloud Console:**
   - Navigate to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project

2. **Open OAuth Credentials:**
   - Go to **APIs & Services** > **Credentials**
   - Click on your OAuth 2.0 Client ID (the one ending in `.apps.googleusercontent.com`)

3. **Add Authorized JavaScript Origins:**
   - Scroll down to **Authorized JavaScript origins**
   - Click **+ ADD URI**
   - Add your Render frontend URL:
     ```
     https://your-app-name.onrender.com
     ```
   - **Important:** Use `https://` (not `http://`) for production
   - Do NOT include a trailing slash

4. **Save Changes:**
   - Click **SAVE** at the bottom

### Step 3: Wait and Test

- Changes in Google Cloud Console can take a few minutes to propagate
- Wait 2-5 minutes, then refresh your Render app
- Try the Google login button again

## Complete List of Authorized Origins

Your **Authorized JavaScript origins** should include:

```
http://localhost:5173
https://your-app-name.onrender.com
```

(And if testing on mobile locally: `http://192.168.x.x:5173`)

## Additional Fix: Button Width Issue

The error about "Provided button width is invalid: 100%" has been fixed in the code. The Google button component doesn't accept percentage widths, so we've wrapped it in a div with 100% width instead.

## Verification Checklist

- [ ] Added Render production URL to Google Cloud Console
- [ ] Used `https://` (not `http://`) for production URL
- [ ] No trailing slash in the URL
- [ ] Saved changes in Google Cloud Console
- [ ] Waited 2-5 minutes for changes to propagate
- [ ] Refreshed the Render app
- [ ] Tested Google login button

## Still Not Working?

1. **Double-check the URL:**
   - Make sure it matches exactly (case-sensitive)
   - No trailing slash
   - Correct protocol (`https://` for production)

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for any other error messages
   - Check Network tab for failed requests

3. **Verify Client ID:**
   - Make sure the Client ID in your Render environment variables matches the one in Google Cloud Console
   - Both frontend and backend should use the same Client ID

4. **Clear Browser Cache:**
   - Sometimes cached credentials can cause issues
   - Try incognito/private browsing mode

## Common Mistakes

❌ **Wrong:** `https://your-app-name.onrender.com/` (trailing slash)
✅ **Correct:** `https://your-app-name.onrender.com`

❌ **Wrong:** `http://your-app-name.onrender.com` (http instead of https)
✅ **Correct:** `https://your-app-name.onrender.com`

❌ **Wrong:** Adding the backend URL instead of frontend URL
✅ **Correct:** Add the frontend URL where users access your app

