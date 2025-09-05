import { User } from './user.model';
import { query } from '../../config/database';
import logger from '../../utils/logger';

export class UserService {
  async getAll(): Promise<User[]> {
    try {
      const sql = 'SELECT id, name, email FROM users';
      return await query<User[]>(sql);
    } catch (error) {
      logger.error('Error fetching users from database:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<User | undefined> {
    try {
      const sql = 'SELECT id, name, email FROM users WHERE id = ?';
      const results = await query<User[]>(sql, [id]);

      if (results && results.length > 0) {
        return results[0];
      }
      return undefined;
    } catch (error) {
      logger.error(`Error fetching user with id ${id} from database:`, error);
      throw error;
    }
  }
}
