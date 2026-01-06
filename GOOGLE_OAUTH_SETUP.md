# Google OAuth Setup Instructions

This guide will help you set up Google OAuth authentication for your application.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. Access to the Google Cloud Console

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** user type
   - Fill in the required fields (App name, User support email, etc.)
   - Add scopes: `email`, `profile`
   - Add test users if needed (for testing phase)
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: LensLogic (or your app name)
   - **Authorized JavaScript origins**: 
     - `http://localhost:5173` (development)
     - Add your production URL when deploying
   - **Authorized redirect URIs**: (Not required for token-based flow, but add these for safety)
     - `http://localhost:5173`
     - `http://localhost:5000`
   - Click **Create**
7. Copy the **Client ID** (you'll need this for your `.env` files)

## Step 2: Configure Backend Environment Variables

Create or update `.env` file in the `backend/` directory:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
JWT_SECRET=your-jwt-secret-here
```

**Important:** Replace `your-google-client-id-here.apps.googleusercontent.com` with your actual Google Client ID from Step 1.

## Step 3: Configure Frontend Environment Variables

Create or update `.env` file in the `frontend/` directory:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:5000/api
```

**Important:** 
- The `VITE_GOOGLE_CLIENT_ID` must match the `GOOGLE_CLIENT_ID` in your backend `.env`
- Use the same Client ID for both frontend and backend

## Step 4: Verify Installation

The following packages have been installed:
- Backend: `google-auth-library`
- Frontend: `@react-oauth/google`

## Step 5: Test the Integration

1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start your frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to the signin or signup page
4. Click the "Continue with Google" button
5. Select a Google account
6. If the user doesn't exist, they will be automatically registered
7. If the user exists, they will be logged in

## How It Works

1. **Frontend**: When user clicks "Continue with Google", the `@react-oauth/google` library handles the OAuth flow
2. **Google**: Returns an ID token (credential) to the frontend
3. **Frontend**: Sends the credential to `/api/auth/google` endpoint
4. **Backend**: Verifies the credential using `google-auth-library`
5. **Backend**: Finds or creates the user in MongoDB
6. **Backend**: Generates a JWT token and returns it
7. **Frontend**: Stores the JWT token and updates the user context
8. **User**: Is now logged in and can access protected routes

## Features

- ✅ Token-based OAuth (no redirect URIs needed)
- ✅ Auto-register if user doesn't exist
- ✅ Auto-login if user exists
- ✅ Same button works for both login and signup
- ✅ JWT-based authentication
- ✅ Secure credential verification on backend
- ✅ Google profile picture and name automatically synced

## Troubleshooting

### Error: "Google OAuth not configured"
- Make sure `GOOGLE_CLIENT_ID` is set in backend `.env` file

### Error: "Invalid Google token"
- Verify that the Client ID in frontend `.env` matches the backend
- Make sure the OAuth consent screen is properly configured
- Check that you're using the correct Client ID (not Client Secret)

### Error: "Email not provided by Google"
- Make sure you've requested the `email` scope in OAuth consent screen
- Verify the user's Google account has an email address

### Button doesn't appear or doesn't work
- Check browser console for errors
- Verify `VITE_GOOGLE_CLIENT_ID` is set in frontend `.env`
- Make sure the `GoogleOAuthProvider` is wrapping your App component

## Production Deployment

When deploying to production:

1. Update **Authorized JavaScript origins** in Google Cloud Console:
   - Add your production frontend URL (e.g., `https://yourdomain.com`)

2. Update frontend `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
   VITE_API_BASE_URL=https://your-backend-domain.com/api
   ```

3. Update backend `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
   JWT_SECRET=your-production-jwt-secret
   ```

4. Ensure your OAuth consent screen is published (not in testing mode) for public use

## Security Notes

- Never expose your Google Client Secret in frontend code
- Always use HTTPS in production
- Keep your JWT_SECRET secure and never commit it to version control
- Use environment variables for all sensitive configuration


