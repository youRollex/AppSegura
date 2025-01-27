import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayLoad } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Estrategia de autenticación JWT para validar tokens de acceso.
 * Esta estrategia se utiliza con Passport para proteger rutas y validar tokens JWT.
 * @class
 * @extends PassportStrategy(Strategy)
 * @decorator @Injectable()
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Crea una instancia de JwtStrategy.
   * @constructor
   * @param {ConfigService} configService - Servicio de configuración para obtener la clave secreta JWT.
   */
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      // Obtiene la clave secreta JWT desde las variables de entorno.
      secretOrKey: configService.get('JWT_SECRET'),
      // Extrae el token JWT del encabezado de autorización como un token Bearer.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /**
   * Valida el payload del token JWT.
   * Este método se ejecuta automáticamente después de que el token JWT es decodificado.
   * @param {JwtPayLoad} payload - El payload decodificado del token JWT.
   * @returns {Promise<string>} El ID del usuario extraído del payload.
   */
  async validate(payload: JwtPayLoad): Promise<string> {
    const { id, jti, exp } = payload;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (exp < currentTimestamp) {
      await this.authService.removeExpiredToken(id, jti);
      throw new UnauthorizedException('Token has expired');
    }

    const isTokenRevoked = await this.authService.isTokenRevoked(id, jti);
    if (!isTokenRevoked) {
      throw new UnauthorizedException('Token has been revoked');
    }
    return id;
  }
}
