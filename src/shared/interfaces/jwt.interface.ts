import { UserRole } from '../enums';

export interface UserJwtInterface {
  sub: string;
  id?: string;
  email?: string;
  username: string;
  role: UserRole;
}
