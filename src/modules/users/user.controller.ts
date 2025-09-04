import { Request, Response } from 'express';
import { UserService } from './user.service';
import { failure, success } from '../../utils/response';
import logger from '../../utils/logger';

const service = new UserService();

export class UserController {
  static getAll(req: Request, res: Response) {
    logger.info('Get all user data..');
    return res.json(success(service.getAll()));
  }

  static getById(req: Request, res: Response) {
    const user = service.getById(Number(req.params.id));
    if (!user) return res.status(404).json(failure('User not found'));

    return res.json(success(user));
  }

  static create(req: Request, res: Response) {
    const { id, name, email } = req.body;
    const user = service.create({ id, name, email });

    return res.status(201).json(success(user, 'User created'));
  }
}
