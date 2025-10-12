const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/terrasense', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Schemas
const landDataSchema = new mongoose.Schema({
  region: { type: String, required: true },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  soilHealth: {
    pH: Number,
    moisture: Number,
    organicMatter: Number,
    nutrients: {
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number
    }
  },
  vegetation: {
    coverage: Number,
    ndvi: Number,
    type: String
  },
  degradationLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  erosionRisk: Number,
  timestamp: { type: Date, default: Date.now },
  aiPrediction: {
    futureRisk: Number,
    confidence: Number,
    recommendedActions: [String]
  }
}, { timestamps: true });

const reforestationSchema = new mongoose.Schema({
  projectName: String,
  region: String,
  area: Number, // in hectares
  treesPlanted: Number,
  targetTrees: Number,
  species: [String],
  survivalRate: Number,
  carbonSequestration: Number,
  startDate: Date,
  status: { type: String, enum: ['Planning', 'Active', 'Completed'] },
  volunteers: Number
}, { timestamps: true });

const alertSchema = new mongoose.Schema({
  region: String,
  alertType: {
    type: String,
    enum: ['Erosion', 'Drought', 'Deforestation', 'Soil Degradation']
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  description: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  status: {
    type: String,
    enum: ['Active', 'Acknowledged', 'Resolved'],
    default: 'Active'
  },
  affectedArea: Number,
  reportedBy: String
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  role: {
    type: String,
    enum: ['Farmer', 'Researcher', 'Policymaker', 'NGO', 'Admin']
  },
  region: String,
  phone: String,
  contributions: {
    dataReports: { type: Number, default: 0 },
    projectsJoined: { type: Number, default: 0 }
  },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

// Models
const LandData = mongoose.model('LandData', landDataSchema);
const Reforestation = mongoose.model('Reforestation', reforestationSchema);
const Alert = mongoose.model('Alert', alertSchema);
const User = mongoose.model('User', userSchema);

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TerraSense API is running', timestamp: new Date() });
});

// ==================== LAND DATA ROUTES ====================

// Get all land data with filters
app.get('/api/landdata', async (req, res) => {
  try {
    const { region, degradationLevel, startDate, endDate } = req.query;
    let query = {};
    
    if (region) query.region = region;
    if (degradationLevel) query.degradationLevel = degradationLevel;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const data = await LandData.find(query).sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get land data by region
app.get('/api/landdata/region/:region', async (req, res) => {
  try {
    const data = await LandData.find({ region: req.params.region })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new land data entry
app.post('/api/landdata', async (req, res) => {
  try {
    const newData = new LandData(req.body);
    await newData.save();
    res.status(201).json({ success: true, data: newData });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get degradation statistics
app.get('/api/landdata/stats/degradation', async (req, res) => {
  try {
    const stats = await LandData.aggregate([
      {
        $group: {
          _id: '$degradationLevel',
          count: { $sum: 1 },
          avgSoilHealth: { $avg: '$soilHealth.moisture' },
          avgVegetation: { $avg: '$vegetation.coverage' }
        }
      }
    ]);
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== REFORESTATION ROUTES ====================

// Get all reforestation projects
app.get('/api/reforestation', async (req, res) => {
  try {
    const { status, region } = req.query;
    let query = {};
    if (status) query.status = status;
    if (region) query.region = region;
    
    const projects = await Reforestation.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new reforestation project
app.post('/api/reforestation', async (req, res) => {
  try {
    const project = new Reforestation(req.body);
    await project.save();
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update reforestation project
app.put('/api/reforestation/:id', async (req, res) => {
  try {
    const project = await Reforestation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get reforestation statistics
app.get('/api/reforestation/stats/overall', async (req, res) => {
  try {
    const stats = await Reforestation.aggregate([
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          totalTreesPlanted: { $sum: '$treesPlanted' },
          totalArea: { $sum: '$area' },
          avgSurvivalRate: { $avg: '$survivalRate' },
          totalCarbonSequestration: { $sum: '$carbonSequestration' }
        }
      }
    ]);
    res.json({ success: true, stats: stats[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ALERT ROUTES ====================

// Get all alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const { status, severity, alertType, region } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (alertType) query.alertType = alertType;
    if (region) query.region = region;
    
    const alerts = await Alert.find(query).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new alert
app.post('/api/alerts', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    
    // Here you could trigger notifications to relevant stakeholders
    // e.g., SMS, email, push notifications
    
    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update alert status
app.patch('/api/alerts/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get active alerts by severity
app.get('/api/alerts/active/severity', async (req, res) => {
  try {
    const alerts = await Alert.aggregate([
      { $match: { status: 'Active' } },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 },
          totalArea: { $sum: '$affectedArea' }
        }
      }
    ]);
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== USER ROUTES ====================

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const { role, region } = req.query;
    let query = {};
    if (role) query.role = role;
    if (region) query.region = region;
    
    const users = await User.find(query).select('-__v');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get user by email
app.get('/api/users/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user contributions
app.patch('/api/users/:id/contributions', async (req, res) => {
  try {
    const { dataReports, projectsJoined } = req.body;
    const update = {};
    if (dataReports !== undefined) update['contributions.dataReports'] = dataReports;
    if (projectsJoined !== undefined) update['contributions.projectsJoined'] = projectsJoined;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: update },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get user statistics by role
app.get('/api/users/stats/role', async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          totalReports: { $sum: '$contributions.dataReports' },
          totalProjects: { $sum: '$contributions.projectsJoined' }
        }
      }
    ]);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ANALYTICS & AI ROUTES ====================

// Get comprehensive dashboard data
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const [landStats, alertStats, projectStats, userStats] = await Promise.all([
      LandData.aggregate([
        {
          $group: {
            _id: null,
            avgSoilHealth: { $avg: '$soilHealth.moisture' },
            avgVegetation: { $avg: '$vegetation.coverage' },
            totalRecords: { $sum: 1 }
          }
        }
      ]),
      Alert.countDocuments({ status: 'Active' }),
      Reforestation.aggregate([
        {
          $group: {
            _id: null,
            totalTrees: { $sum: '$treesPlanted' },
            activeProjects: { $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] } }
          }
        }
      ]),
      User.countDocuments({ verified: true })
    ]);
    
    res.json({
      success: true,
      data: {
        landHealth: landStats[0] || {},
        activeAlerts: alertStats,
        reforestation: projectStats[0] || {},
        activeUsers: userStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI prediction endpoint (mock implementation)
app.post('/api/analytics/predict', async (req, res) => {
  try {
    const { region, soilData, climateData } = req.body;
    
    // Mock AI prediction logic
    // In production, this would call your ML model
    const prediction = {
      region,
      degradationRisk: Math.random() * 100,
      confidence: 85 + Math.random() * 10,
      timeframe: '6 months',
      recommendedActions: [
        'Increase soil organic matter through composting',
        'Implement contour farming techniques',
        'Plant cover crops during off-season',
        'Establish erosion control structures'
      ],
      impactMetrics: {
        potentialSoilLoss: Math.random() * 50,
        vegetationDecline: Math.random() * 30,
        waterRetentionChange: Math.random() * 40
      }
    };
    
    res.json({ success: true, prediction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get time-series analysis
app.get('/api/analytics/timeseries/:region', async (req, res) => {
  try {
    const { region } = req.params;
    const { months = 6 } = req.query;
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    
    const data = await LandData.aggregate([
      {
        $match: {
          region,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' }
          },
          avgSoilHealth: { $avg: '$soilHealth.moisture' },
          avgVegetation: { $avg: '$vegetation.coverage' },
          avgErosionRisk: { $avg: '$erosionRisk' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==================== SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 TerraSense API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌍 Access at: http://localhost:${PORT}/api/health`);
});