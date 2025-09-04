import app from './app';
import { ENV } from './config/env';
import logger from './utils/logger';
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const logDirectory = path.join('logs', String(year), month);

fs.mkdirSync(logDirectory, { recursive: true });

app.listen(ENV.PORT, () => {
  logger.info(`🚀 Server running on port ${ENV.PORT}`);
});
