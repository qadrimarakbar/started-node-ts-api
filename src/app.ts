import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './modules/users/user.route';
import authRoutes from './modules/auth/auth.route';
import { routeNotFound } from './utils/response';
import corsOptions from './config/cors';

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

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// 404 Handler - Place it after all routes
app.use((req, res) => {
  const response = routeNotFound(req);
  res.status(404).json(response);
});

// Error handler
app.use(errorHandler);

export default app;
