# 🚀 TerraSense Complete Setup Guide

## ⚡ Quick Setup (5 Minutes)

### Prerequisites Check
```bash
# Check Node.js (should be v14+)
node --version

# Check npm
npm --version

# Check if MongoDB is installed
mongod --version
```

If any are missing, install them first!

---

## 📦 Step 1: Project Setup

### Option A: Using the Provided Files

```bash
# 1. Create project directory
mkdir terrasense-platform
cd terrasense-platform

# 2. Save all the provided files in this directory:
#    - server.js
#    - package.json
#    - seedData.js
#    - .env.example
#    - .gitignore
#    - README.md

# 3. Install dependencies
npm install
```

### Option B: Full Manual Setup

```bash
# 1. Create project
mkdir terrasense-platform
cd terrasense-platform
npm init -y

# 2. Install backend dependencies
npm install express mongoose cors dotenv helmet express-rate-limit

# 3. Install dev dependencies
npm install --save-dev nodemon concurrently

# 4. Copy all provided code files to the directory
```

---

## 🗄️ Step 2: Database Setup

### Option A: Local MongoDB

```bash
# Start MongoDB service
# On macOS:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# On Windows:
net start MongoDB
```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

---

## ⚙️ Step 3: Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use any text editor
```

**Minimum required .env settings:**
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/terrasense
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/terrasense
```

---

## 🌱 Step 4: Seed the Database

```bash
# Run the seeder script
npm run seed

# You should see:
# ✅ Connected to MongoDB
# ✅ Inserted X land data records
# ✅ Inserted X reforestation projects
# ✅ Inserted X alerts
# ✅ Inserted X users
```

---

## 🎯 Step 5: Start the Backend Server

```bash
# Start in development mode (with auto-reload)
npm run dev

# OR start in production mode
npm start

# You should see:
# 🚀 TerraSense API Server running on port 5000
# ✅ MongoDB connected successfully
```

### Test the API:
Open your browser and go to: `http://localhost:5000/api/health`

You should see:
```json
{
  "status": "OK",
  "message": "TerraSense API is running",
  "timestamp": "2025-10-11T..."
}
```

---

## 💻 Step 6: Frontend Setup

### Create React App

```bash
# In a NEW terminal window (keep backend running)

# Go back to project root
cd terrasense-platform

# Create React app
npx create-react-app client

# Navigate to client directory
cd client

# Install additional dependencies
npm install recharts lucide-react
```

### Add the React Component

1. Open `client/src/App.js`
2. Delete all existing code
3. Copy and paste the entire TerraSense React component (from the artifact)
4. Save the file

### Update Tailwind CSS

```bash
# In client directory, install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Edit `client/tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Edit `client/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Start React Development Server

```bash
# In client directory
npm start

# React app will open at http://localhost:3000
```

---

## ✅ Step 7: Verify Everything Works

### Backend Tests

```bash
# Test all endpoints (in a new terminal)
curl http://localhost:5000/api/health
curl http://localhost:5000/api/landdata
curl http://localhost:5000/api/reforestation
curl http://localhost:5000/api/alerts
curl http://localhost:5000/api/users
curl http://localhost:5000/api/analytics/dashboard
```

### Frontend Test

1. Open `http://localhost:3000` in your browser
2. You should see the TerraSense dashboard
3. Try switching between tabs: Dashboard, AI Analytics, Community
4. Check if charts and data are displaying correctly

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: MongoDB connection failed**
```bash
# Solution 1: Check if MongoDB is running
ps aux | grep mongo

# Solution 2: Start MongoDB
mongod --dbpath /path/to/your/data/directory
```

**Problem: Port 5000 already in use**
```bash
# Solution: Change PORT in .env file
PORT=5001
```

**Problem: Module not found**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Problem: Cannot find recharts or lucide-react**
```bash
cd client
npm install recharts lucide-react
```

**Problem: Blank screen**
```bash
# Check browser console for errors (F12)
# Make sure you copied the complete React component
```

---

## 📊 Accessing the Application

### Backend API
- URL: `http://localhost:5000`
- Health Check: `http://localhost:5000/api/health`
- API Docs: See API_TESTING.md

### Frontend Dashboard
- URL: `http://localhost:3000`
- Features: Dashboard, AI Analytics, Community

---

## 🎨 Demo Presentation Tips

1. **Start with the Problem** - Show slides explaining land degradation challenges
2. **Show Live Backend** - Demonstrate API endpoints returning real data
3. **Interactive Frontend** - Navigate through all tabs showing features
4. **Real-time Updates** - Point out the live monitoring animation
5. **Technical Stack** - Mention MERN + AI/ML integration
6. **Impact Metrics** - Highlight the statistics and predictions

### Key Demo Points:
- ✅ Real-time monitoring dashboard
- ✅ AI-powered risk predictions
- ✅ Interactive data visualizations
- ✅ Community engagement features
- ✅ RESTful API with comprehensive endpoints
- ✅ Scalable, production-ready architecture

---

## 📁 Project Structure Overview

```
terrasense-platform/
├── server.js              # Main backend server
├── seedData.js            # Database seeder
├── package.json           # Backend dependencies
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
│
└── client/               # React frontend
    ├── public/
    ├── src/
    │   ├── App.js       # Main TerraSense component
    │   └── index.css    # Tailwind styles
    └── package.json     # Frontend dependencies
```

---

## 🚀 Ready to Present!

Your TerraSense platform is now fully set up and ready to demo. Good luck with your hackathon! 🏆

### Final Checklist:
- [x] Backend server running on port 5000
- [x] MongoDB connected with sample data
- [x] Frontend running on port 3000
- [x] All features working correctly
- [x] Data visualizations displaying
- [x] API endpoints responding

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check that ports 5000 and 3000 are available
5. Review the .env file configuration

**You're all set! 🎉**