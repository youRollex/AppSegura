import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayLoad } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

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
  constructor(configService: ConfigService) {
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
    const { id } = payload;

    return id;
  }
}
