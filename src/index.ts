import app from './app';
import { ENV } from './config/env';
import logger from './utils/logger';
import fs from 'fs';
import path from 'path';
import { testConnection } from './config/database';
import { mongoDatabase } from './config/mongodb';

// Create logs directory if it doesn't exist
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const logDirectory = path.join('logs', String(year), month);

fs.mkdirSync(logDirectory, { recursive: true });

// Start the server
const startServer = async () => {
  try {
    // Test MySQL database connection
    await testConnection();

    // Connect to MongoDB
    await mongoDatabase.connect();

    app.listen(ENV.PORT, () => {
      logger.info(`🚀 Server running on port ${ENV.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
