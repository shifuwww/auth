import { UserRole } from '../enums';

export interface RegisterType {
  username: string;
  password: string;
  email: string;
  role: UserRole[];
}
