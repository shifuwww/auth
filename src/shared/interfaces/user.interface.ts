import { BaseInterface } from 'src/common/base';
import { UserRoleEnum } from '../enums';

export interface UserInterface extends BaseInterface {
  username: string;
  password: string;
  email: string;
  role: UserRoleEnum;
  token: string;
}
