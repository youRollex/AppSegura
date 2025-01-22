import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import * as qs from 'qs';

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
      
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.AUTH_SERVICE_URL}/auth/login`,
          loginUserDto,
        ),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
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
    console.error('Error en la solicitud HTTP:', error);
    throw new Error('Error en la solicitud HTTP');
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
}
