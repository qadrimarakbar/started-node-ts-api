import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './modules/users/user.route';
import { routeNotFound } from './utils/response';
import corsOptions from './config/cors';

const app = express();

// Middleware global
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);

// 404 Handler - Place it after all routes
app.use((req, res) => {
  const response = routeNotFound(req);
  res.status(404).json(response);
});

// Error handler
app.use(errorHandler);

export default app;
