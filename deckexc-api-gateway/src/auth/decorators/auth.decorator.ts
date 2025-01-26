import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';

/**
 * Decorador para proteger rutas con autenticación y autorización basada en roles.
 * Combina los decoradores `RoleProtected` y `UseGuards` para aplicar la lógica de autenticación y validación de roles.
 * @function
 * @param {...ValidRoles[]} roles - Roles válidos para acceder a la ruta.
 * @returns Un decorador compuesto que aplica la protección de ruta.
 * @example
 * @Auth(ValidRoles.ADMIN, ValidRoles.USER)
 * @Get('protected-route')
 * getProtectedData() { ... }
 */
export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
