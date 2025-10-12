const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/terrasense', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB for seeding'))
.catch((err) => console.error('❌ Connection error:', err));

// Import models (assuming they're in the same structure as server.js)
const landDataSchema = new mongoose.Schema({
  region: String,
  coordinates: { latitude: Number, longitude: Number },
  soilHealth: {
    pH: Number,
    moisture: Number,
    organicMatter: Number,
    nutrients: { nitrogen: Number, phosphorus: Number, potassium: Number }
  },
  vegetation: { coverage: Number, ndvi: Number, type: String },
  degradationLevel: String,
  erosionRisk: Number,
  timestamp: Date,
  aiPrediction: {
    futureRisk: Number,
    confidence: Number,
    recommendedActions: [String]
  }
}, { timestamps: true });

const reforestationSchema = new mongoose.Schema({
  projectName: String,
  region: String,
  area: Number,
  treesPlanted: Number,
  targetTrees: Number,
  species: [String],
  survivalRate: Number,
  carbonSequestration: Number,
  startDate: Date,
  status: String,
  volunteers: Number
}, { timestamps: true });

const alertSchema = new mongoose.Schema({
  region: String,
  alertType: String,
  severity: String,
  description: String,
  coordinates: { latitude: Number, longitude: Number },
  status: String,
  affectedArea: Number,
  reportedBy: String
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  region: String,
  phone: String,
  contributions: { dataReports: Number, projectsJoined: Number },
  verified: Boolean
}, { timestamps: true });

const LandData = mongoose.model('LandData', landDataSchema);
const Reforestation = mongoose.model('Reforestation', reforestationSchema);
const Alert = mongoose.model('Alert', alertSchema);
const User = mongoose.model('User', userSchema);

// Sample data
const sampleLandData = [
  {
    region: 'Northern Region',
    coordinates: { latitude: 1.2921, longitude: 36.8219 },
    soilHealth: {
      pH: 6.5,
      moisture: 45,
      organicMatter: 3.2,
      nutrients: { nitrogen: 0.15, phosphorus: 0.08, potassium: 0.12 }
    },
    vegetation: { coverage: 65, ndvi: 0.6, type: 'Grassland' },
    degradationLevel: 'Medium',
    erosionRisk: 55,
    timestamp: new Date(),
    aiPrediction: {
      futureRisk: 68,
      confidence: 87,
      recommendedActions: ['Implement terracing', 'Plant cover crops', 'Add organic matter']
    }
  },
  {
    region: 'Eastern Region',
    coordinates: { latitude: -1.2864, longitude: 38.8172 },
    soilHealth: {
      pH: 5.8,
      moisture: 35,
      organicMatter: 2.5,
      nutrients: { nitrogen: 0.10, phosphorus: 0.05, potassium: 0.08 }
    },
    vegetation: { coverage: 40, ndvi: 0.4, type: 'Sparse vegetation' },
    degradationLevel: 'High',
    erosionRisk: 75,
    timestamp: new Date(),
    aiPrediction: {
      futureRisk: 85,
      confidence: 92,
      recommendedActions: ['Urgent reforestation', 'Erosion control structures', 'Soil conservation']
    }
  },
  {
    region: 'Western Region',
    coordinates: { latitude: -0.4172, longitude: 34.2850 },
    soilHealth: {
      pH: 7.2,
      moisture: 60,
      organicMatter: 4.5,
      nutrients: { nitrogen: 0.20, phosphorus: 0.12, potassium: 0.18 }
    },
    vegetation: { coverage: 85, ndvi: 0.8, type: 'Forest' },
    degradationLevel: 'Low',
    erosionRisk: 25,
    timestamp: new Date(),
    aiPrediction: {
      futureRisk: 30,
      confidence: 78,
      recommendedActions: ['Maintain current practices', 'Monitor regularly']
    }
  },
  {
    region: 'Southern Region',
    coordinates: { latitude: -4.0435, longitude: 39.6682 },
    soilHealth: {
      pH: 6.8,
      moisture: 50,
      organicMatter: 3.8,
      nutrients: { nitrogen: 0.18, phosphorus: 0.10, potassium: 0.15 }
    },
    vegetation: { coverage: 70, ndvi: 0.65, type: 'Mixed vegetation' },
    degradationLevel: 'Medium',
    erosionRisk: 45,
    timestamp: new Date(),
    aiPrediction: {
      futureRisk: 52,
      confidence: 85,
      recommendedActions: ['Contour plowing', 'Agroforestry integration']
    }
  }
];

const sampleReforestation = [
  {
    projectName: 'Green Valley Initiative',
    region: 'Northern Region',
    area: 250,
    treesPlanted: 12000,
    targetTrees: 15000,
    species: ['Acacia', 'Eucalyptus', 'Indigenous trees'],
    survivalRate: 85,
    carbonSequestration: 3600,
    startDate: new Date('2024-01-15'),
    status: 'Active',
    volunteers: 156
  },
  {
    projectName: 'Coastal Restoration',
    region: 'Eastern Region',
    area: 180,
    treesPlanted: 8500,
    targetTrees: 10000,
    species: ['Mangroves', 'Coconut palms'],
    survivalRate: 92,
    carbonSequestration: 2550,
    startDate: new Date('2023-09-20'),
    status: 'Active',
    volunteers: 89
  },
  {
    projectName: 'Highland Forest Recovery',
    region: 'Western Region',
    area: 400,
    treesPlanted: 20000,
    targetTrees: 20000,
    species: ['Cedar', 'Podocarpus', 'Bamboo'],
    survivalRate: 88,
    carbonSequestration: 6000,
    startDate: new Date('2023-03-10'),
    status: 'Completed',
    volunteers: 423
  }
];

const sampleAlerts = [
  {
    region: 'Eastern Region',
    alertType: 'Erosion',
    severity: 'High',
    description: 'Severe soil erosion detected in agricultural area',
    coordinates: { latitude: -1.2864, longitude: 38.8172 },
    status: 'Active',
    affectedArea: 45,
    reportedBy: 'Satellite Monitoring System'
  },
  {
    region: 'Northern Region',
    alertType: 'Drought',
    severity: 'Medium',
    description: 'Low soil moisture levels detected',
    coordinates: { latitude: 1.2921, longitude: 36.8219 },
    status: 'Acknowledged',
    affectedArea: 120,
    reportedBy: 'Local Farmer'
  },
  {
    region: 'Southern Region',
    alertType: 'Deforestation',
    severity: 'Critical',
    description: 'Rapid vegetation loss in protected area',
    coordinates: { latitude: -4.0435, longitude: 39.6682 },
    status: 'Active',
    affectedArea: 78,
    reportedBy: 'Field Survey Team'
  }
];

const sampleUsers = [
  {
    name: 'John Kamau',
    email: 'john.kamau@example.com',
    role: 'Farmer',
    region: 'Northern Region',
    phone: '+254712345678',
    contributions: { dataReports: 15, projectsJoined: 3 },
    verified: true
  },
  {
    name: 'Dr. Sarah Wanjiru',
    email: 'sarah.wanjiru@research.org',
    role: 'Researcher',
    region: 'Western Region',
    phone: '+254723456789',
    contributions: { dataReports: 42, projectsJoined: 8 },
    verified: true
  },
  {
    name: 'Peter Omondi',
    email: 'peter.omondi@gov.ke',
    role: 'Policymaker',
    region: 'Eastern Region',
    phone: '+254734567890',
    contributions: { dataReports: 8, projectsJoined: 12 },
    verified: true
  },
  {
    name: 'Grace Mwangi',
    email: 'grace.mwangi@ngo.org',
    role: 'NGO',
    region: 'Southern Region',
    phone: '+254745678901',
    contributions: { dataReports: 28, projectsJoined: 15 },
    verified: true
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await LandData.deleteMany({});
    await Reforestation.deleteMany({});
    await Alert.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Insert sample data
    console.log('📊 Inserting land data...');
    await LandData.insertMany(sampleLandData);
    console.log(`✅ Inserted ${sampleLandData.length} land data records\n`);

    console.log('🌳 Inserting reforestation projects...');
    await Reforestation.insertMany(sampleReforestation);
    console.log(`✅ Inserted ${sampleReforestation.length} reforestation projects\n`);

    console.log('🚨 Inserting alerts...');
    await Alert.insertMany(sampleAlerts);
    console.log(`✅ Inserted ${sampleAlerts.length} alerts\n`);

    console.log('👥 Inserting users...');
    await User.insertMany(sampleUsers);
    console.log(`✅ Inserted ${sampleUsers.length} users\n`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('📈 Summary:');
    console.log(`   - Land Data Records: ${sampleLandData.length}`);
    console.log(`   - Reforestation Projects: ${sampleReforestation.length}`);
    console.log(`   - Active Alerts: ${sampleAlerts.length}`);
    console.log(`   - Registered Users: ${sampleUsers.length}`);
    console.log('\n✨ You can now start the server with: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();