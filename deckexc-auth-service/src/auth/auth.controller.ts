import { Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreatePaymentDetailDto } from './dto/create-payment-detail.dto';
import { userInfo } from 'os';
import { UpdatePaymentDetailDto } from './dto/update-payment-detail.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  findAllUser() {
    return this.authService.findAll();
  }

  @Get('users/:id')
  findOneUser(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
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
  createPaymentDetails(@Body() createPaymentDetails: CreatePaymentDetailDto) {
    return this.authService.createPaymentDetail(createPaymentDetails);
  }

  @Delete('payment/:userId')
  deletePaymentDetail(@Param('userId') userInfo: string) {
    return this.authService.deletePaymentDetail(userInfo);
  }

  @Get('payment/:userId')
  getPaymentDetailsByUser(@Param('userId') userInfo: string) {
    return this.authService.findPaymentDetailByUser(userInfo);
  }

  @Patch('payment')
  updatePaymentDetails(@Body() updatePaymentDetails: UpdatePaymentDetailDto){
    return this.authService.updatePaymentDetail(updatePaymentDetails);
  }
}
