import { ActivateRegisterInterface } from '../interfaces';

export type ResendActivateMailType = Omit<ActivateRegisterInterface, 'code'>;
