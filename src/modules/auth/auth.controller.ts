import { Request, Response } from 'express';
import authService from './auth.service';
import { LoginRequest, RegisterRequest } from './auth.model';
import { loginSchema, registerSchema } from './auth.validation';
import { errorResponse, successResponse } from '../../utils/response';
import logger from '../../utils/logger';
import InvalidCredentialsError from './auth.error';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        const response = errorResponse('Validation failed', error.details);
        res.status(400).json(response);
        return;
      }

      const userData: RegisterRequest = value;
      const result = await authService.register(userData);

      // Set JWT token in httpOnly cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
      });

      // Remove token from response body for security
      const userResult = { user: result.user };
      const response = successResponse('User registered successfully', userResult);
      res.status(201).json(response);
    } catch (error) {
      logger.error('Registration error:', error);

      if (error instanceof Error) {
        if (error.message === 'Email already registered') {
          const response = errorResponse('Email already registered');
          res.status(409).json(response);
          return;
        }
      }

      const response = errorResponse('Registration failed');
      res.status(500).json(response);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        logger.warn('Login validation failed:', error.details);
        res.status(400).json(errorResponse('Validation failed', error.details));
        return;
      }

      const loginData: LoginRequest = value;
      const result = await authService.login(loginData);

      // Set JWT token in httpOnly cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      logger.info('User logged in:', { email: result.user.email });

      // Remove token from response body for security
      const userResult = { user: result.user };
      res.status(200).json(successResponse('Login successful', userResult));
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        logger.warn(`Login failed ${req.body.email}: ${error.message}`);
        res.status(401).json(errorResponse(error.message));
        return;
      }

      if (error instanceof Error && error.message === 'Invalid email or password') {
        logger.warn(`Login failed ${req.body.email}: ${error.message}`);
        res.status(401).json(errorResponse(error.message));
        return;
      }

      logger.error('Login error:', error);

      const response = errorResponse('Login failed');
      res.status(500).json(response);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      // Clear the token cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      logger.info('User logged out');
      res.status(200).json(successResponse('Logout successful'));
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json(errorResponse('Logout failed'));
    }
  }

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Get user from request (set by auth middleware)
      const userId = req.user?.id;

      if (!userId) {
        const response = errorResponse('User not found');
        res.status(401).json(response);
        return;
      }

      const user = await authService.findUserById(userId);
      if (!user) {
        const response = errorResponse('User not found');
        res.status(404).json(response);
        return;
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      const response = successResponse('User profile retrieved', userData);
      res.status(200).json(response);
    } catch (error) {
      logger.error('Get profile error:', error);
      const response = errorResponse('Failed to get user profile');
      res.status(500).json(response);
    }
  }
}

export default new AuthController();
