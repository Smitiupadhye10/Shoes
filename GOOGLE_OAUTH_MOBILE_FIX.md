# Fix Google OAuth "Missing client_id" Error on Mobile

## Problem
You're seeing "Missing required parameter: client_id" error when trying to use Google OAuth on mobile devices.

## Solutions

### Solution 1: Restart Development Server
**IMPORTANT:** After modifying `.env` files, you MUST restart your Vite dev server for changes to take effect.

1. Stop your frontend dev server (Ctrl+C or Cmd+C)
2. Start it again:
   ```bash
   cd frontend
   npm run dev
   ```

### Solution 2: Add Mobile/Network IP to Google Cloud Console

When testing on mobile, you're likely accessing the app via your computer's local IP address (e.g., `http://192.168.x.x:5173`), which must be added to Google Cloud Console.

1. **Find your computer's local IP address:**
   - **Mac/Linux:** Run `ipconfig getifaddr en0` or `ifconfig | grep "inet "`
   - **Windows:** Run `ipconfig` and look for IPv4 Address
   - You'll get something like `192.168.1.100`

2. **Update Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to **APIs & Services** > **Credentials**
   - Click on your OAuth 2.0 Client ID
   - Under **Authorized JavaScript origins**, add:
     - `http://192.168.x.x:5173` (replace with your actual IP)
     - `http://localhost:5173`
     - Your production URL if applicable
   - Click **Save**

### Solution 3: Verify Environment Variable is Loaded

1. Open browser console (F12 or right-click > Inspect)
2. Check if there's a warning about missing `VITE_GOOGLE_CLIENT_ID`
3. Verify the Client ID is correct in `frontend/.env`:
   ```
   VITE_GOOGLE_CLIENT_ID=230208194801-qqqh5gbqltoa96k1g46i10h823s4t09r.apps.googleusercontent.com
   ```

### Solution 4: Use Same Network for Mobile Testing

- Ensure your mobile device and computer are on the **same Wi-Fi network**
- Access the app on mobile using: `http://YOUR_IP:5173` (not localhost)

### Solution 5: Check for Trailing Spaces

Make sure there are no trailing spaces in your `.env` file. The file should look like:
```
VITE_API_BASE_URL=http://localhost:4000/api
VITE_GOOGLE_CLIENT_ID=230208194801-qqqh5gbqltoa96k1g46i10h823s4t09r.apps.googleusercontent.com
```

## Quick Checklist

- [ ] Restarted frontend dev server after `.env` changes
- [ ] Added mobile IP address to Google Cloud Console authorized origins
- [ ] Verified `.env` file has correct Client ID (no trailing spaces)
- [ ] Mobile device and computer on same network
- [ ] Using IP address (not localhost) to access app on mobile
- [ ] Backend `.env` also has the same `GOOGLE_CLIENT_ID`

## Still Not Working?

1. Check browser console for specific error messages
2. Verify the Client ID matches exactly in both frontend and backend `.env` files
3. Try clearing browser cache/cookies
4. Check if your Google Cloud project has OAuth consent screen properly configured


