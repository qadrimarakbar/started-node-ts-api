import { Router } from 'express';
import authController from './auth.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));

// Protected routes
router.get('/me', authMiddleware, authController.me.bind(authController));

export default router;
