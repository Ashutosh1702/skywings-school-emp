require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
const startServer = async () => {
  try {
    if (process.env.MONGO_URI) {
      await connectDB();
      // Auto-seed initial demo dataset if database has 0 users
      try {
        const { autoSeedIfNeeded } = require('./utils/seeder');
        await autoSeedIfNeeded();
      } catch (e) {
        console.warn('Auto-seed check notice:', e.message);
      }
    }
    app.listen(PORT, () => {
      console.log(`SkyWings ERP Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

