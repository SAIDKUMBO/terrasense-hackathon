# 🌐 TerraSense Deployment Guide

## 🎯 Deployment Options

### Backend Deployment
- **Render** ⭐ (Recommended - Free tier)
- **Railway** (Easy setup)
- **Heroku** (Popular choice)
- **DigitalOcean** (VPS option)

### Frontend Deployment
- **Vercel** ⭐ (Recommended - Instant)
- **Netlify** (Great for React)
- **GitHub Pages** (Free hosting)

### Database
- **MongoDB Atlas** ⭐ (Recommended - Free 512MB)

---

## 📦 Part 1: MongoDB Atlas Setup

### Step 1: Create Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for free account
3. Create a new project: "TerraSense"
4. Build a cluster (FREE tier - M0 Sandbox)
5. Choose region closest to you
6. Cluster name: "TerraSense-Cluster"

### Step 2: Configure Security

1. Database Access:
   - Username: `terrasense_user`
   - Password: Generate secure password
   - Database User Privileges: Read and write to any database

2. Network Access:
   - Add IP Address: `0.0.0.0/0` (Allow from anywhere)
   - Or add specific deployment platform IPs

### Step 3: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string:
   ```
   mongodb+srv://terrasense_user:<password>@terrasense-cluster.xxxxx.mongodb.net/terrasense?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Save this for later!

### Step 4: Seed Production Database

```bash
# Update .env with Atlas connection string
MONGODB_URI=mongodb+srv://...

# Run seeder
npm run seed
```

---

## 🚀 Part 2: Backend Deployment (Render)

### Step 1: Prepare Backend

1. Create `Procfile` in root directory:
```bash
web: node server.js
```

2. Update `package.json` add start script:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

3. Create `.gitignore` (already provided)

### Step 2: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add files
git add .

# Commit
git commit -m "Initial commit - TerraSense Backend"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/terrasense-backend.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Render

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `terrasense-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://... (your Atlas string)
   ```

7. Click "Create Web Service"
8. Wait 5-10 minutes for deployment
9. Get your URL: `https://terrasense-api.onrender.com`

### Step 4: Test Deployed Backend

```bash
curl https://terrasense-api.onrender.com/api/health
```

---

## 💻 Part 3: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Update API calls in React component:

```javascript
// In client/src/App.js, add API URL constant
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Update all fetch calls to use:
fetch(`${API_URL}/api/landdata`)
```

2. Create `.env.production` in client folder:
```bash
REACT_APP_API_URL=https://terrasense-api.onrender.com