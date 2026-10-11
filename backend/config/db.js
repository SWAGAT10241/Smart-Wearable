const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Connects to MongoDB (works for local Mongo, MongoDB Atlas, or IBM Cloud
// Databases for MongoDB — just change MONGODB_URI in .env, no code changes needed)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('database.connected');
  } catch (err) {
    logger.error('database.connection_failed', { error: err });
    process.exit(1);
  }
};

module.exports = connectDB;