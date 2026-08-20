const mongoose = require('mongoose');

// Connects to MongoDB (works for local Mongo, MongoDB Atlas, or IBM Cloud
// Databases for MongoDB — just change MONGODB_URI in .env, no code changes needed)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected:', mongoose.connection.host);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;