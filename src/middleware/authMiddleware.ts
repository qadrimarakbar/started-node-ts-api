import { NextFunction, Request, Response } from 'express';
import authService from '../modules/auth/auth.service';
import { errorResponse } from '../utils/response';
import logger from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try to get token from cookie first, then from Authorization header
    let token = req.cookies?.token;

    if (!token) {
      const authorization = req.headers.authorization;
      if (authorization && authorization.startsWith('Bearer ')) {
        token = authorization.substring(7);
      }
    }

    if (!token) {
      const response = errorResponse('Access denied. No token provided.');
      res.status(401).json(response);
      return;
    }

    // Verify token
    const decoded = authService.verifyToken(token);

    // Get user data
    const user = await authService.findUserById(decoded.id);
    if (!user) {
      const response = errorResponse('User not found');
      res.status(401).json(response);
      return;
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);

    if (error instanceof Error && error.message === 'Invalid or expired token') {
      // Clear invalid cookie if it exists
      if (req.cookies?.token) {
        res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
      }

      const response = errorResponse('Invalid or expired token');
      res.status(401).json(response);
      return;
    }

    const response = errorResponse('Authentication failed');
    res.status(401).json(response);
  }
};
