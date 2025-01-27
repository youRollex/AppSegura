import {
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UnauthorizedException,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreatePaymentDetailDto } from './dto/create-payment-detail.dto';
import { UpdatePaymentDetailDto } from './dto/update-payment-detail.dto';
import { Auth, GetUser } from './decorators';
import { LogOutUserDto } from './dto/logOut-user.dto';

/**
 * Controlador para manejar las operaciones de autenticación y gestión de usuarios.
 * @class
 * @decorator @Controller('auth')
 */
@Controller('auth')
export class AuthController {
  /**
   * Crea una instancia de AuthController.
   * @constructor
   * @param {AuthService} authService - Servicio de autenticación.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Obtiene todos los usuarios registrados.
   * @returns Lista de usuarios.
   * @decorator @Get('users')
   */
  @Get('users')
  findAllUser() {
    return this.authService.findAll();
  }

  /**
   * Registra un nuevo usuario.
   * @param {CreateUserDto} createUserDto - Datos del usuario a registrar.
   * @returns El usuario creado.
   * @decorator @Post('register')
   */
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  /**
   * Inicia sesión de un usuario.
   * @param {LoginUserDto} loginUserDto - Credenciales de inicio de sesión.
   * @returns Token de autenticación.
   * @throws {UnauthorizedException} Si las credenciales son incorrectas o la cuenta está bloqueada.
   * @decorator @Post('login')
   */
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      return await this.authService.login(loginUserDto);
    } catch (error) {
      if (error.message.includes('La cuenta está bloqueada')) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException('Credenciales incorrectas.');
    }
  }

  @Post('logout')
  async logOutUser(@Body() logOutUserDto: LogOutUserDto) {
    return await this.authService.removeExpiredToken(
      logOutUserDto.userId,
      logOutUserDto.jti,
    );
  }

  /**
   * Restablece la contraseña de un usuario.
   * @param {ResetPasswordDto} resetPasswordDto - Datos para restablecer la contraseña.
   * @returns
   * @decorator @Post('reset')
   */
  @Post('reset')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * Obtiene la pregunta de seguridad asociada a un correo electrónico.
   * @param {string} email - Correo electrónico del usuario.
   * @returns La pregunta de seguridad.
   * @decorator @Get('question/:email')
   */
  @Get('question/:email')
  getQuestion(@Param('email') email: string) {
    return this.authService.getQuestion(email);
  }

  /**
   * Crea los detalles de pago de un usuario autenticado.
   * @param {CreatePaymentDetailDto} createPaymentDetails - Datos de los detalles de pago.
   * @returns Los detalles de pago creados.
   * @decorator @Post('payment')
   * @decorator @Auth()
   */
  @Post('payment')
  @Auth()
  createPaymentDetails(@Body() createPaymentDetails: CreatePaymentDetailDto) {
    return this.authService.createPaymentDetail(createPaymentDetails);
  }

  /**
   * Elimina los detalles de pago de un usuario autenticado.
   * @param {string} userId - ID del usuario autenticado.
   * @returns
   * @decorator @Delete('payment')
   * @decorator @Auth()
   */
  @Delete('payment')
  @Auth()
  deletePaymentDetail(@GetUser() userId: string) {
    return this.authService.deletePaymentDetail(userId);
  }

  /**
   * Obtiene los detalles de pago de un usuario autenticado.
   * @param {string} userId - ID del usuario autenticado.
   * @returns Los detalles de pago del usuario.
   * @decorator @Get('payment')
   * @decorator @Auth()
   */
  @Get('payment')
  @Auth()
  getPaymentDetailsByUser(@GetUser() userId: string) {
    return this.authService.findPaymentDetailByUser(userId);
  }

  /**
   * Actualiza los detalles de pago de un usuario autenticado.
   * @param {UpdatePaymentDetailDto} updatePaymentDetails - Datos actualizados de los detalles de pago.
   * @returns Los detalles de pago actualizados.
   * @decorator @Patch('payment')
   * @decorator @Auth()
   */
  @Patch('payment')
  @Auth()
  updatePaymentDetails(@Body() updatePaymentDetails: UpdatePaymentDetailDto) {
    return this.authService.updatePaymentDetail(updatePaymentDetails);
  }
}
