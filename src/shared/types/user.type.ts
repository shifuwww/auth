import { UserInterface } from '../interfaces';

export type CreateUserType = Omit<
  UserInterface,
  'id' | 'createdAt' | 'updatedAt' | 'role' | 'token'
>;

export type GetUserType = Omit<
  UserInterface,
  'token' | 'password' | 'createdAt' | 'updatedAt'
>;

export type GetUserByAdminType = Omit<UserInterface, 'token' | 'password'>;
