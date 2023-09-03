import { UserRoleEnum } from '../enums';

export interface UserAtJwtInterface {
  sub: string;
  id?: string;
  email?: string;
  username: string;
  role: UserRoleEnum;
}

export interface UserRtJwtInterface extends UserAtJwtInterface {
  refreshToken: string;
}
