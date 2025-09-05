import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, UserController.getAll);
router.get('/:id', authMiddleware, UserController.getById);

export default router;
