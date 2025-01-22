import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayLoad } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, answer, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        answer: bcrypt.hashSync(answer, 10),
      });

      await this.userRepository.save(user);
      delete user.password;
      delete user.answer;

      return { ...user, token: this.getJwtToken({ id: user.id }) };
    } catch (error) {
      this.handlerDBErrors(error);
    }
  }

  private getJwtToken(payload: JwtPayLoad) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, failedLoginAttempts: true, accountLockedUntil:true },
    });

    if (!user)
      throw new UnauthorizedException('Credentals are not valid (email)');
    
    // Verificar si la cuenta esta bloqueada
    if (user.accountLockedUntil && user.accountLockedUntil > new Date().getTime()){
      const lockTimeRemaining = (user.accountLockedUntil - new Date().getTime()) /1000;
      throw new UnauthorizedException(`Account is locked. Try again in ${lockTimeRemaining.toFixed(0)} seconds`);
    }

    // Comparar la Contraseña
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(`Credentials are not valid (password)`);

    // Restablecer intentos fallidos y desbloquear cuenta
    user.failedLoginAttempts = 0;
    user.accountLockedUntil = 0;  // Desbloquea inmediato si es login exitoso
    await this.userRepository.save(user);

    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }

  // Metodo de validacion de Login para contar intentos fallidos
  async handleFailedLogin(user: User){
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= 4){
      // Bloquear la cuenta por 3 minutos después de 4 intentos fallidos
      user.accountLockedUntil = new Date().getTime() + 3 * 60 * 1000; // 3 Minutos
    }

    await this.userRepository.save(user);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, answer, password } = resetPasswordDto;

    // Buscar al usuario por correo electrónico
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Comparar la respuesta de seguridad
    if (!bcrypt.compareSync(answer, user.answer))
      throw new BadRequestException('Security answer is incorrect');

    // Actualizar la contraseña
    user.password = bcrypt.hashSync(password, 10);
    await this.userRepository.save(user);

    return { message: 'Password has been successfully updated.' };
  }

  async getQuestion(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return { question: user.question };
  }

  private handlerDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }

  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}
