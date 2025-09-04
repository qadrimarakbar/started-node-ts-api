import mysql from 'mysql2/promise';
import { ENV } from './env';
import logger from '../utils/logger';

// Create connection pool
const pool = mysql.createPool({
  host: ENV.DATABASE.HOST,
  user: ENV.DATABASE.USER,
  password: ENV.DATABASE.PASSWORD,
  database: ENV.DATABASE.NAME,
  port: ENV.DATABASE.PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection function
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    logger.info('MySQL database connection established successfully');
    connection.release();
  } catch (error) {
    logger.error('Failed to connect to MySQL database:', error);
    throw error;
  }
};

// Execute query with parameters
export const query = async <T>(sql: string, params?: unknown[]): Promise<T> => {
  try {
    const [results] = await pool.execute(sql, params);
    return results as T;
  } catch (error) {
    logger.error(`Database query error: ${sql}`, error);
    throw error;
  }
};

// Get a connection from the pool
export const getConnection = async () => {
  try {
    return await pool.getConnection();
  } catch (error) {
    logger.error('Failed to get database connection from pool', error);
    throw error;
  }
};

export default {
  testConnection,
  query,
  getConnection,
  pool,
};
