import { Post, Body, Param, Delete, Patch, UnauthorizedException } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreatePaymentDetailDto } from './dto/create-payment-detail.dto';
import { UpdatePaymentDetailDto } from './dto/update-payment-detail.dto';
import { Auth } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  findAllUser() {
    return this.authService.findAll();
  }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

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

  @Post('reset')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('question/:email')
  getQuestion(@Param('email') email: string) {
    return this.authService.getQuestion(email);
  }

  @Post('payment')
  @Auth()
  createPaymentDetails(@Body() createPaymentDetails: CreatePaymentDetailDto) {
    return this.authService.createPaymentDetail(createPaymentDetails);
  }

  @Delete('payment/:userId')
  deletePaymentDetail(@Param('userId') userInfo: string) {
    return this.authService.deletePaymentDetail(userInfo);
  }

  @Get('payment/:userId')
  @Auth()
  getPaymentDetailsByUser(@Param('userId') userInfo: string) {
    return this.authService.findPaymentDetailByUser(userInfo);
  }

  @Patch('payment')
  @Auth()
  updatePaymentDetails(@Body() updatePaymentDetails: UpdatePaymentDetailDto) {
    return this.authService.updatePaymentDetail(updatePaymentDetails);
  }
}
