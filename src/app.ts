import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './modules/users/user.route';
import authRoutes from './modules/auth/auth.route';
import bookRoutes from './modules/books/book.route';
import { routeNotFound } from './utils/response';
import corsOptions from './config/cors';
import { query } from './config/database';

const app = express();

// Middleware global
app.use(
  cors({
    ...corsOptions,
    credentials: true, // Important for cookies
  })
);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser()); // Add cookie parser

// Health check endpoint untuk Docker
app.get('/health', async (_req, res) => {
  const baseResponse = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  };

  try {
    const start = process.hrtime.bigint();
    await query('SELECT 1');
    const latencyMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    res.status(200).json({
      ...baseResponse,
      database: {
        status: 'UP',
        latencyMs,
      },
    });
  } catch (error) {
    res.status(503).json({
      ...baseResponse,
      status: 'ERROR',
      database: {
        status: 'DOWN',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/books', bookRoutes);

// 404 Handler - Place it after all routes
app.use((req, res) => {
  const response = routeNotFound(req);
  res.status(404).json(response);
});

// Error handler
app.use(errorHandler);

export default app;
