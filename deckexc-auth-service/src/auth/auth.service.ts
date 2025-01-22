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
import * as crypto from 'crypto';
import { JwtPayLoad } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CreatePaymentDetailDto } from './dto/create-payment-detail.dto';
import { BankDetails } from './entities/user.bankDetails.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BankDetails)
    private readonly bank_detailsRepository: Repository<BankDetails>,
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

  async createPaymentDetail(createPaymentDetails: CreatePaymentDetailDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: createPaymentDetails.userId },
      });
      if (!user) {
        throw new Error('User not found');
      }

      const encryptedCardNumber = this.encryptData(
        createPaymentDetails.cardNumber,
      );
      const encryptedCvc = this.encryptData(createPaymentDetails.cvc);
      const encryptedExpirationDate = this.encryptData(
        createPaymentDetails.expirationDate,
      );

      const bankDetail = this.bank_detailsRepository.create({
        ...createPaymentDetails,
        cardNumber: encryptedCardNumber,
        cvc: encryptedCvc,
        expirationDate: encryptedExpirationDate,
      });
      await this.bank_detailsRepository.save(bankDetail);
      return {
        id: bankDetail.id,
        userId: bankDetail.userId,
        cardNumber: this.maskCardNumber(
          this.decryptData(bankDetail.cardNumber),
        ),
        cvc: '***',
        expirationDate: this.maskExpirationDate(
          this.decryptData(bankDetail.expirationDate),
        ),
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  private encryptData(data: string): string {
    const key = crypto
      .createHash('sha256')
      .update(process.env.ENCRYPTION_KEY)
      .digest('hex')
      .slice(0, 32);

    const iv = crypto
      .createHash('sha256')
      .update(process.env.ENCRYPTION_IV)
      .digest('hex')
      .slice(0, 16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decryptData(encryptedData: string): string {
    const key = crypto
      .createHash('sha256')
      .update(process.env.ENCRYPTION_KEY)
      .digest('hex')
      .slice(0, 32);

    const iv = crypto
      .createHash('sha256')
      .update(process.env.ENCRYPTION_IV)
      .digest('hex')
      .slice(0, 16);

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private maskCardNumber(cardNumber: string): string {
    return cardNumber.replace(/\d(?=\d{4})/g, '*');
  }

  private maskExpirationDate(expirationDate: string): string {
    const [year, month] = expirationDate.split('/');
    return `**/${month}/${year.slice(2)}`;
  }

  async deletePaymentDetail(userInfo: string) {
    const paymentDetail = await this.bank_detailsRepository.findOne({
      where: { userId: userInfo },
    });

    if (!paymentDetail) {
      throw new NotFoundException('Payment detail not found');
    }

    await this.bank_detailsRepository.remove(paymentDetail);

    return { message: 'Payment detail successfully deleted' };
  }

  async findPaymentDetailByUser(userInfo: string) {
    const paymentDetails = await this.bank_detailsRepository.findOne({
      where: { userId: userInfo },
    });

    if (!paymentDetails) {
      throw new NotFoundException('No payment details found for this user');
    }

    return paymentDetails;
  }
}
