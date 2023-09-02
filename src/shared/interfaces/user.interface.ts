import { BaseInterface } from 'src/common/base';

export interface UserInterface extends BaseInterface {
  username: string;
  password: string;
  email: string;
}
