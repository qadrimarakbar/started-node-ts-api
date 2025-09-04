export interface User {
  id: number;
  name: string;
  email: string;
}

export const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' },
];
