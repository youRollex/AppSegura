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

@Injectable()
export class AuthService {
  private readonly AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
  private readonly SECRET_KEY = process.env.SECRET_KEY;

  constructor(private readonly httpService: HttpService) {}

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
        password: loginUserDto.password
      }

      const response = await lastValueFrom(
        this.httpService.post(
          `${this.AUTH_SERVICE_URL}/auth/login`,
          data,
        ),
      );
      return response.data;
    } catch (error) {
      console.log("error: ", error.response.data.message)
      throw new HttpException(error.response.data.message, error.response.data.statusCode);
    }
  }

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

  private handleHttpExceptions(error: any) {
    console.error('Error en la solicitud HTTP:', error.message);
    throw new Error('Error en la solicitud HTTP ' + error);
  }

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
