import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces'; // Es una enumeración no una interfaz

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
