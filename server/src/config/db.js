const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skywings_erp', {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.log('ℹ️ Server will continue running to handle API requests.');
    console.log('ℹ️ To enable database persistence, please ensure MongoDB is running (e.g. `mongod` or MongoDB Atlas URI in server/.env).');
  }
};

module.exports = connectDB;
