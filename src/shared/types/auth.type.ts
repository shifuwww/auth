import { ActivateRegisterInterface, RegisterInterface } from '../interfaces';

export type ResendActivateMailType = Omit<ActivateRegisterInterface, 'code'>;

export type ForgotPasswordType = Pick<RegisterInterface, 'email'>;

export type ValidatePasswordChangeType = ForgotPasswordType & {
  code: string;
};

export type ChangePasswordType = ForgotPasswordType & {
  password: string;
};
