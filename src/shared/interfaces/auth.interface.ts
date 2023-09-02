import { UserRoleEnum } from '../enums';

export interface RegisterInterface {
  username: string;
  password: string;
  email: string;
  role: UserRoleEnum;
}

export interface ActivateRegisterInterface
  extends Pick<RegisterInterface, 'username'> {
  code: string;
}

export interface LoginInterface {
  username: string;
  password: string;
}
