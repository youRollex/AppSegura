import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces'; // Es una enumeración no una interfaz

/**
 * Clave utilizada para almacenar los roles en los metadatos.
 * @constant {string}
 */
export const META_ROLES = 'roles';

/**
 * Decorador para proteger rutas basadas en roles.
 * Almacena los roles permitidos en los metadatos de la ruta.
 * @function
 * @param {...ValidRoles[]} args - Roles válidos para acceder a la ruta.
 * @returns Un decorador que establece los roles en los metadatos.
 * @example
 * @RoleProtected(ValidRoles.ADMIN, ValidRoles.USER)
 * @Get('admin-route')
 * getAdminData() { ... }
 */
export const RoleProtected = (...args: ValidRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
