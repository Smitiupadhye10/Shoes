# Render Frontend Deployment Guide

## Backend URL
Your backend is deployed at: **https://shoes-0vzt.onrender.com**

## Frontend Configuration
The frontend `.env` file has been configured with:
```
VITE_API_BASE_URL=https://shoes-0vzt.onrender.com/api
```

## Steps to Deploy Frontend to Render

### 1. Create a New Static Site on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository (or use the same repo as backend)

### 2. Configure Build Settings

**Build Command:**
```bash
cd frontend && npm install && npm run build
```

**Publish Directory:**
```
frontend/dist
```

### 3. Add Environment Variables

In the Render dashboard, go to **Environment** tab and add:

```
VITE_API_BASE_URL=https://shoes-0vzt.onrender.com/api
VITE_GOOGLE_CLIENT_ID=230208194801-qqqh5gbqltoa96k1g46i10h823s4t09r.apps.googleusercontent.com
```

**Important:** 
- Environment variables in Render will override the `.env` file
- Make sure `VITE_API_BASE_URL` is set to your backend URL

### 4. Deploy

1. Click **"Create Static Site"**
2. Render will automatically build and deploy your frontend
3. Your frontend will be available at: `https://your-frontend-name.onrender.com`

## Testing

After deployment:
1. Visit your frontend URL
2. Check browser console for any errors
3. Verify products are loading from: `https://shoes-0vzt.onrender.com/api/products`

## Troubleshooting

### Products not loading?
1. Check browser console for CORS errors
2. Verify backend is running: https://shoes-0vzt.onrender.com
3. Verify environment variables are set correctly in Render
4. Check network tab to see if API calls are going to the correct URL

### CORS Issues?
The backend has `app.use(cors())` which should allow all origins. If you encounter CORS issues, you may need to configure CORS more specifically in `backend/index.js`.

## Local Development

For local development, comment out `VITE_API_BASE_URL` in `.env` to use the Vite proxy:
```env
# VITE_API_BASE_URL=https://shoes-0vzt.onrender.com/api
```

This will make the frontend use `/api` which proxies to `http://localhost:4000` via Vite.
