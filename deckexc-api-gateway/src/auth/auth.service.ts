import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import * as qs from 'qs';
import { CreatePaymentDetailDto } from './dto/create-payment-detail.dto';
import { UpdatePaymentDetailDto } from './dto/update-payment-detail.dto';

/**
 * Servicio para manejar la autenticación y operaciones relacionadas con usuarios.
 * @class
 * @decorator @Injectable()
 */
@Injectable()
export class AuthService {
  private readonly AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
  private readonly SECRET_KEY = process.env.SECRET_KEY;

  /**
   * Crea una instancia de AuthService.
   * @constructor
   * @param {HttpService} httpService - Servicio HTTP para realizar solicitudes externas.
   */
  constructor(private readonly httpService: HttpService) {}

  /**
   * Registra un nuevo usuario.
   * @param {CreateUserDto} createUserDto - Datos del usuario a registrar.
   * @returns Respuesta del servicio de autenticación.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
  async create(createUserDto: CreateUserDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.AUTH_SERVICE_URL}/auth/register`,
          createUserDto,
        ),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  /**
   * Inicia sesión de un usuario.
   * @param {LoginUserDto} loginUserDto - Credenciales de inicio de sesión.
   * @returns Respuesta del servicio de autenticación.
   * @throws {HttpException} Si el captcha es inválido o las credenciales son incorrectas.
   */
  async login(loginUserDto: LoginUserDto) {
    try {
      const { captchaToken } = loginUserDto;
      if (!captchaToken) {
        this.handleHttpExceptions('Captcha es obligatorio.');
      }

      const isCaptchaValid = await this.validateCaptcha(captchaToken);

      if (!isCaptchaValid) {
        this.handleHttpExceptions('Captcha inválido.');
      }

      const data = {
        email: loginUserDto.email,
        password: loginUserDto.password,
      };

      const response = await lastValueFrom(
        this.httpService.post(`${this.AUTH_SERVICE_URL}/auth/login`, data),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.response.data.statusCode,
      );
    }
  }

  /**
   * Restablece la contraseña de un usuario.
   * @param {ResetPasswordDto} resetPasswordDto - Datos para restablecer la contraseña.
   * @returns Respuesta del servicio de autenticación.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.AUTH_SERVICE_URL}/auth/reset`,
          resetPasswordDto,
        ),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  /**
   * Obtiene la pregunta de seguridad asociada a un correo electrónico.
   * @param {string} email - Correo electrónico del usuario.
   * @returns Respuesta del servicio de autenticación.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
  async getQuestion(email: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.AUTH_SERVICE_URL}/auth/question/${email}`),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  /**
   * Obtiene todos los usuarios registrados.
   * @returns Respuesta del servicio de autenticación.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
  async findAll() {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.AUTH_SERVICE_URL}/auth/users`),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  /**
   * Maneja excepciones relacionadas con solicitudes HTTP.
   * @private
   * @param {any} error - Error capturado.
   * @throws {Error} Lanza una excepción con el mensaje de error.
   */
  private handleHttpExceptions(error: any) {
    console.error('Error en la solicitud HTTP:', error.message);
    throw new Error('Error en la solicitud HTTP ' + error);
  }

  /**
   * Valida un token de captcha utilizando el servicio de Google reCAPTCHA.
   * @private
   * @param {string} token - Token de captcha a validar.
   * @returns {Promise<boolean>} `true` si el captcha es válido, `false` en caso contrario.
   */
  private async validateCaptcha(token: string): Promise<boolean> {
    try {
      const body = qs.stringify({
        secret: this.SECRET_KEY,
        response: token,
      });

      const response = await firstValueFrom(
        this.httpService.post(
          'https://www.google.com/recaptcha/api/siteverify',
          body,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );
      return response.data.success;
    } catch (error) {
      console.error('Error validating captcha:', error.message);
      return false;
    }
  }

  /**
   * Crea los detalles de pago de un usuario.
   * @param {CreatePaymentDetailDto} createPaymentDetails - Datos de los detalles de pago.
   * @returns Respuesta del servicio de autenticación.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
  async createPaymentDetail(createPaymentDetails: CreatePaymentDetailDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.AUTH_SERVICE_URL}/auth/payment`,
          createPaymentDetails,
        ),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  /**
   * Elimina los detalles de pago de un usuario.
   * @param {string} userInfo - ID del usuario.
   * @returns Respuesta del servicio de autenticación.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
  async deletePaymentDetail(userInfo: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.delete(
          `${this.AUTH_SERVICE_URL}/auth/payment/${userInfo}`,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  /**
   * Obtiene los detalles de pago de un usuario.
   * @param {string} userInfo - ID del usuario.
   * @returns Respuesta del servicio de autenticación.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
  async findPaymentDetailByUser(userInfo: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.AUTH_SERVICE_URL}/auth/payment/${userInfo}`,
        ),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  /**
   * Actualiza los detalles de pago de un usuario.
   * @param {UpdatePaymentDetailDto} updatePaymentDetails - Datos actualizados de los detalles de pago.
   * @returns Respuesta del servicio de autenticación.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
  async updatePaymentDetail(updatePaymentDetails: UpdatePaymentDetailDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.patch(
          `${this.AUTH_SERVICE_URL}/auth/payment`,
          updatePaymentDetails,
        ),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }
}
