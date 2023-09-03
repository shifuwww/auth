import { ActivateRegisterInterface, RegisterInterface } from '../interfaces';

export type ResendActivateMailType = Omit<ActivateRegisterInterface, 'code'>;

export type ForgetPasswordType = Pick<RegisterInterface, 'email'>;

export type ValidatePasswordChangeType = ForgetPasswordType & {
  code: string;
};

export type ChangePasswordType = ForgetPasswordType & {
  password: string;
};
