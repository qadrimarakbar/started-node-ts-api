import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret',
  CORS: {
    ORIGIN: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    METHODS: process.env.CORS_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    ALLOWED_HEADERS: process.env.CORS_ALLOWED_HEADERS?.split(',') || [
      'Content-Type',
      'Authorization',
    ],
    CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
    MAX_AGE: parseInt(process.env.CORS_MAX_AGE || '86400', 10),
  },
  DATABASE: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'node_api_db',
    PORT: parseInt(process.env.DB_PORT || '3306', 10),
  },
};
