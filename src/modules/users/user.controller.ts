import { Request, Response } from 'express';
import { UserService } from './user.service';
import { failure, success } from '../../utils/response';
import logger from '../../utils/logger';

const service = new UserService();

export class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      const users = await service.getAll();
      return res.json(success(users));
    } catch (error) {
      logger.error('Error in getAll controller:', error);
      return res.status(500).json(failure('Failed to retrieve users', 500));
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const user = await service.getById(Number(req.params.id));
      if (!user) return res.status(404).json(failure('User not found'));

      return res.json(success(user));
    } catch (error) {
      logger.error('Error in getById controller:', error);
      return res.status(500).json(failure('Failed to retrieve user', 500));
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json(failure('Name and email are required'));
      }

      const user = await service.create({ id: 0, name, email });
      return res.status(201).json(success(user, 'User created'));
    } catch (error) {
      logger.error('Error in create controller:', error);
      return res.status(500).json(failure('Failed to create user', 500));
    }
  }
}
