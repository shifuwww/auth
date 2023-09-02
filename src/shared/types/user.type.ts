import { UserInterface } from '../interfaces';

export type CreateUserType = Omit<
  UserInterface,
  'id' | 'createdAt' | 'updatedAt' | 'role'
>;
