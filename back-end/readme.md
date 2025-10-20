# 🌍 TerraSense - Land Degradation Monitoring Platform

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file (already created)
# Update MongoDB URI if needed

# Seed database
npm run seed

# Start server
npm start
```

## API Endpoints
- GET /api/health - Health check
- GET /api/landdata - Get all land data
- GET /api/reforestation - Get reforestation projects
- GET /api/alerts - Get alerts
- GET /api/users - Get users
- GET /api/analytics/dashboard - Dashboard data

## Tech Stack
- MongoDB + Express + React + Node.js
- AI/ML Integration
- Real-time Monitoring

Visit http://localhost:5000/api/health to test!
EOF

echo "✅ README.md created"

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. cd terrasense-hackathon"
echo "2. Copy server.js and seedData.js from the artifacts"
echo "3. npm install"
echo "4. npm run seed"
echo "5. npm start"
echo ""
echo "🚀 Your API will be at: http://localhost:5000"