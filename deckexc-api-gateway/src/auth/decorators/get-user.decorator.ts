import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

/**
 * Decorador para extraer el usuario autenticado de la solicitud.
 * @function
 * @param {string} [data] - Campo específico del usuario que se desea extraer (opcional).
 * @param {ExecutionContext} ctx - Contexto de ejecución de NestJS.
 * @returns {any} El usuario autenticado o un campo específico del usuario.
 * @throws {InternalServerErrorException} Si no se encuentra el usuario en la solicitud.
 * @example
 * @Get('profile')
 * getProfile(@GetUser() user: User) {
 *   return user;
 * }
 */
export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;

  if (!user) throw new InternalServerErrorException('User not found (request)');

  return !data ? user : user[data];
});
