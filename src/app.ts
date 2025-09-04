import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './modules/users/user.route';
import logger from './utils/logger';

const app = express();

// Middleware global
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);

// 404 Handler - Place it after all routes
app.use((req, res) => {
  logger.error('Route not found', {
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// Error handler
app.use(errorHandler);

export default app;
