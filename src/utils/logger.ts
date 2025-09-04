import winston from 'winston';
import path from 'path';

// Get current date
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const date = String(now.getDate()).padStart(2, '0');

// Create logs directory structure
const logDirectory = path.join('logs', String(year), month);

// Console format
const consoleFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
  return `${timestamp} ${level}: ${message} ${metaStr}`.trim();
});

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    // Write all logs with importance level of 'info' or less to the daily log file
    new winston.transports.File({
      filename: path.join(logDirectory, `${date}.log`),
      level: 'info',
    }),
    // Write all logs with importance level of 'error' or less to error.log
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error',
    }),
  ],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.colorize(),
        consoleFormat
      ),
    })
  );
}

export default logger;
