import { User, users } from './user.model';

export class UserService {
  getAll(): User[] {
    return users;
  }

  getById(id: number): User | undefined {
    return users.find(u => u.id === id);
  }

  create(user: User): User {
    users.push(user);
    return user;
  }
}
