import { UserRole } from '../enums';

export interface RegisterInterface {
  username: string;
  password: string;
  email: string;
  role: UserRole[];
}

export interface ActivateRegisterInterface
  extends Pick<RegisterInterface, 'username'> {
  code: string;
}
