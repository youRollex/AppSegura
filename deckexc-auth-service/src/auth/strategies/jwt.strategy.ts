import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayLoad } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

/**
 * Estrategia de autenticación JWT para el uso con Passport en NestJS.
 * Utiliza un token JWT extraído del encabezado Authorization para autenticar usuarios.
*/

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Crea una nueva instancia de JwtStrategy.
   * @param userRepository Repositorio de la entidad `User` para buscar al usuario en la base de datos.
   * @param configService Servicio de configuración para acceder a las variables de entorno.
  */
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,  // Inyecta el repositorio de `User`
    configService: ConfigService,                       // Inyecta el servicio de configuración
  ) {
    super({
      /**
       * Define la clave secreta para verificar el token JWT, la cual se obtiene desde las variables de entorno.
       * Se utiliza para asegurar que el token no haya sido alterado.
      */
      secretOrKey: configService.get('JWT_SECRET'),

      /**
       * Define la forma en que se extrae el token JWT de la solicitud.
       * En este caso, se extrae del encabezado de autorización como un Bearer Token.
      */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /**
   * Valida el payload del JWT. Si el usuario asociado al token no se encuentra en la base de datos, se lanza una excepción de "Unauthorized".
   * @param payload Contiene los datos decodificados del token JWT.
   * @returns El objeto `User` correspondiente a la identificación del payload si es válido.
   * @throws UnauthorizedException Si el usuario no existe.
  */

  async validate(payload: JwtPayLoad): Promise<User> {
    // Extrae el ID del usuario desde el payload del token
    const { id } = payload;   

    // Busca al usuario en la base de datos usando el ID extraído del payload
    const user = await this.userRepository.findOneBy({ id });

    // Si no se encuentra el usuario, lanza una excepción de "Unauthorized"
    if (!user) throw new UnauthorizedException('Token not valid');

    // Si el usuario es válido, lo devuelve
    return user;
  }
}
