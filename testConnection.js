// testConnection.js
const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://said:mombasa22@terrasense.xo0xaly.mongodb.net/terrasense?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
