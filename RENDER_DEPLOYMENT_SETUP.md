# Render Deployment Setup for Google OAuth

## Problem
When deploying to Render, Google OAuth shows "Google login is not configured. Please contact support."

This happens because environment variables need to be configured separately in Render.

## Solution: Add Environment Variables in Render

### For Frontend (Static Site or Web Service)

1. **Go to your Render Dashboard:**
   - Navigate to [Render Dashboard](https://dashboard.render.com/)
   - Select your frontend service

2. **Add Environment Variables:**
   - Click on **Environment** in the left sidebar
   - Click **Add Environment Variable**
   - Add the following variables:

   ```
   Key: VITE_GOOGLE_CLIENT_ID
   Value: 230208194801-qqqh5gbqltoa96k1g46i10h823s4t09r.apps.googleusercontent.com
   ```

   ```
   Key: VITE_API_BASE_URL
   Value: https://your-backend-app-name.onrender.com/api
   ```
   (Replace `your-backend-app-name` with your actual Render backend service name)

3. **Redeploy:**
   - After adding environment variables, Render should automatically redeploy
   - If not, click **Manual Deploy** > **Deploy latest commit**

### For Backend Service

1. **Go to your Backend Service in Render:**
   - Navigate to your backend service

2. **Add Environment Variables:**
   - Click on **Environment** in the left sidebar
   - Click **Add Environment Variable**
   - Add:

   ```
   Key: GOOGLE_CLIENT_ID
   Value: 230208194801-qqqh5gbqltoa96k1g46i10h823s4t09r.apps.googleusercontent.com
   ```

   ```
   Key: JWT_SECRET
   Value: 3796f0f8ec0a7998905887db5a2e2f88a2228b9b4c95aee16177067c43005fd0c7d2e8cad5ce57d38c5cc0094074a94f334d9e0f3368c54f3f0a9308491c4923
   ```

   ```
   Key: MONGODB_URI
   Value: your-mongodb-connection-string
   ```

   (Add any other environment variables your backend needs)

3. **Redeploy:**
   - Save and redeploy your backend service

## Important: Update Google Cloud Console

After deploying to Render, you **must** add your production URL to Google Cloud Console:

1. **Go to Google Cloud Console:**
   - Navigate to [Google Cloud Console](https://console.cloud.google.com/)
   - Go to **APIs & Services** > **Credentials**
   - Click on your OAuth 2.0 Client ID

2. **Add Authorized JavaScript Origins:**
   - Under **Authorized JavaScript origins**, add:
     - `https://your-frontend-app-name.onrender.com`
     - `http://localhost:5173` (for local development)
     - Your local IP if testing on mobile: `http://192.168.x.x:5173`

3. **Save Changes**

## Verify Setup

After deployment:

1. Visit your Render frontend URL
2. Try clicking "Continue with Google"
3. It should now show the Google login popup instead of the error message

## Environment Variables Checklist

### Frontend (.env or Render Environment)
- [ ] `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- [ ] `VITE_API_BASE_URL` - Your Render backend API URL

### Backend (Render Environment)
- [ ] `GOOGLE_CLIENT_ID` - Same as frontend (must match!)
- [ ] `JWT_SECRET` - Secret key for JWT tokens
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] Any other environment variables your backend needs

## Notes

- Environment variables set in Render take precedence over `.env` files
- Frontend environment variables must start with `VITE_` to be accessible in Vite apps
- Both frontend and backend must use the **same** `GOOGLE_CLIENT_ID`
- Changes to environment variables require a redeploy to take effect

