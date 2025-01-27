import { Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreatePaymentDetailDto } from './dto/create-payment-detail.dto';
import { userInfo } from 'os';
import { UpdatePaymentDetailDto } from './dto/update-payment-detail.dto';
import { TokenDataDto } from './dto/token-data.dto';

/**
 * Controlador de autenticación y gestión de pagos.
 * Maneja las rutas relacionadas con el registro de usuarios, login, restablecimiento de contraseñas y detalles de pago.
 */

@Controller('auth')
export class AuthController {
  /**
   * Constructor del controlador que inyecta el servicio de autenticación.
   * @param authService Servicio de autenticación que maneja la lógica de negocio
   */
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  /**
   * Ruta GET para obtener todos los usuarios.
   * @returns Lista de usuarios.
   */
  findAllUser() {
    return this.authService.findAll(); // Llama al servicio para obtener todos los usuarios
  }

  /**
   * Ruta GET para obtener un usuario específico por su ID.
   * @param id El ID del usuario a buscar
   * @returns Los detalles del usuario encontrado.
   */
  @Get('users/:id')
  findOneUser(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  /**
   * Ruta POST para registrar un nuevo usuario.
   * @param createUserDto Datos del usuario a crear.
   * @returns El usuario creado.
   */
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  /**
   * Ruta POST para realizar el login de un usuario.
   * @param loginUserDto Datos de login del usuario (email y contraseña)
   * @returns El token JWT o una respuesta del login.
   */
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  /**
   * Ruta POST para restablecer la contraseña de un usuario.
   * @param resetPasswordDto Datos necesarios para restablecer la contraseña (email, respuesta a pregunta de seguridad y nueva contraseña)
   * @returns Un mensaje de éxito o error sobre el restablecimiento de la contraseña.
   */
  @Post('reset')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * Ruta GET para obtener la pregunta de seguridad de un usuario según su email.
   * @param email El email del usuario
   * @returns La pregunta de seguridad asociada al usuario.
   */
  @Get('question/:email')
  getQuestion(@Param('email') email: string) {
    return this.authService.getQuestion(email);
  }

  /**
   * Ruta POST para crear los detalles de pago de un usuario.
   * @param createPaymentDetails Datos del pago (número de tarjeta, CVC, fecha de expiración)
   * @returns Los detalles de pago creados.
   */
  @Post('payment')
  createPaymentDetails(@Body() createPaymentDetails: CreatePaymentDetailDto) {
    return this.authService.createPaymentDetail(createPaymentDetails);
  }

  /**
   * Ruta DELETE para eliminar los detalles de pago de un usuario.
   * @param userId El ID del usuario cuya información de pago se eliminará
   * @returns Un mensaje de éxito o error.
   */
  @Delete('payment/:userId')
  deletePaymentDetail(@Param('userId') userInfo: string) {
    return this.authService.deletePaymentDetail(userInfo);
  }

  /**
   * Ruta GET para obtener los detalles de pago de un usuario específico.
   * @param userId El ID del usuario cuyos detalles de pago se solicitan
   * @returns Los detalles de pago del usuario.
   */
  @Get('payment/:userId')
  getPaymentDetailsByUser(@Param('userId') userInfo: string) {
    return this.authService.findPaymentDetailByUser(userInfo);
  }

  /**
   * Ruta PATCH para actualizar los detalles de pago de un usuario.
   * @param updatePaymentDetails Datos de actualización de los detalles de pago (pueden ser CVC, fecha de expiración, etc.)
   * @returns Los detalles de pago actualizados.
   */
  @Patch('payment')
  updatePaymentDetails(@Body() updatePaymentDetails: UpdatePaymentDetailDto) {
    return this.authService.updatePaymentDetail(updatePaymentDetails);
  }

  /**
   * Ruta POST para verificar si un token ha sido revocado.
   * @param tokenData Contiene el ID de usuario (userId) y el JTI del token.
   * @returns Un objeto que indica si el token ha sido revocado.
   */
  @Post('check')
  async checkTokenRevoked(@Body() tokenData: TokenDataDto) {
    const isRevoked = await this.authService.validateJti(
      tokenData.userId,
      tokenData.jti,
    );
    return { isRevoked };
  }

  /**
   * Ruta POST para eliminar un token (logout) de un usuario.
   * @param tokenData Contiene el ID de usuario (userId) y el JTI del token.
   * @returns Un mensaje indicando el resultado del logout.
   */
  @Post('remove')
  async remove(@Body() tokenData: TokenDataDto) {
    return await this.authService.logout(tokenData.userId, tokenData.jti);
  }
}
