import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

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
}
