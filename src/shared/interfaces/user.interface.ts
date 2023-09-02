import { BaseInterface } from 'src/common/base';
import { UserRole } from '../enums';

export interface UserInterface extends BaseInterface {
  username: string;
  password: string;
  email: string;
  role: UserRole;
}
