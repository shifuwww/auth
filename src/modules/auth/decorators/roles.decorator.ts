import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/shared/const';

export const Roles = (...roles: string[]) => {
  console.log(roles);
  return SetMetadata(ROLES_KEY, roles);
};
