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
import { UpdatePaymentDetailDto } from './dto/update-payment-detail.dto';
import { Token } from './entities/token.entity';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BankDetails)
    private readonly bank_detailsRepository: Repository<BankDetails>,
    @InjectRepository(Token)
    private readonly token_revokeRepository: Repository<Token>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Crea un nuevo usuario, guarda su información y devuelve un token JWT.
   * @param createUserDto Datos necesarios para crear un nuevo usuario.
   * @returns Un objeto con los datos del usuario y un token JWT.
   * @throws BadRequestException Si ocurre un error al crear el usuario.
   */
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, answer, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        // Encriptacion de contraaseña y respuesta de seguridad.
        password: bcrypt.hashSync(password, 10),
        answer: bcrypt.hashSync(answer, 10),
      });

      await this.userRepository.save(user);
      // Eliminacion de la contraseña y respuesta antes de devolverlas.
      delete user.password;
      delete user.answer;

      return { message: 'User created' };
    } catch (error) {
      this.handlerDBErrors(error);
    }
  }

  /**
   * Genera un token JWT con un `jti` único.
   * @param payload Datos del usuario que se incluirán en el payload del token.
   * @returns Un token JWT.
   */
  private async getJwtToken(payload: JwtPayLoad) {
    const jti = uuidv4();
    await this.saveJti(payload.id, jti);
    const token = this.jwtService.sign({ ...payload, jti: jti });
    return token;
  }

  /**
   * Guarda el identificador único del token (jti) en la base de datos.
   * @param userId ID del usuario.
   * @param jti Identificador único del token.
   * @returns El token guardado en la base de datos.
   * @throws Error Si ocurre un problema al guardar el jti.
   */
  private async saveJti(userId: string, jti: string) {
    //await this.token_revokeRepository.delete({});
    const token = this.token_revokeRepository.create({ userId, jti });
    const tokencreadodb = await this.token_revokeRepository.save(token);
    return tokencreadodb;
  }

  /**
   * Valida el token JWT verificando el `jti` en la tabla `Token`.
   * @param userId ID del usuario autenticado.
   * @param jti Identificador único del token.
   * @returns `true` si el jti es válido, `false` si ha sido revocado.
   * @throws UnauthorizedException Si el `jti` no coincide.
   */
  async validateJti(userId: string, jti: string) {
    console.log('todos los token♥ ', await this.token_revokeRepository.find());
    const token = await this.token_revokeRepository.findOne({
      where: { userId, jti },
    });

    if (!token) {
      throw new UnauthorizedException('Token is invalid or has been revoked');
    }

    return token ? true : false;
  }

  /**
   * Realiza el logout de un usuario al eliminar el jti de la base de datos.
   * @param userId El ID del usuario que está realizando el logout.
   * @param jti El identificador único del token que se desea revocar.
   * @throws Error Si ocurre un problema al eliminar el jti.
   */
  async logout(userId: string, jti: string) {
    const token = await this.token_revokeRepository.findOne({
      where: { userId, jti },
    });
    if (!token) {
      throw new Error('Token not found or already revoked');
    }
    await this.token_revokeRepository.remove(token);
  }

  /**
   * Realiza el proceso de login, validando el correo y la contraseña del usuario.
   * @param loginUserDto Contiene las credenciales del usuario.
   * @returns Un objeto con el email del usuario y su token JWT.
   * @throws UnauthorizedException Si las credenciales son incorrectas.
   */
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'email',
        'password',
        'id',
        'failedLoginAttempts',
        'accountLockedUntil',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas (email)');
    }

    if (
      user.accountLockedUntil &&
      new Date().getTime() < user.accountLockedUntil.getTime()
    ) {
      const remainingTime =
        (user.accountLockedUntil.getTime() - new Date().getTime()) / 1000;
      throw new UnauthorizedException(
        `La cuenta está bloqueada. Inténtalo nuevamente en ${remainingTime.toFixed(0)} segundos.`,
      );
    }

    if (!bcrypt.compareSync(password, user.password)) {
      await this.handleFailedLogin(user);
      throw new UnauthorizedException('Credenciales inválidas (contraseña)');
    }

    // Resetear contador de intentos fallidos y desbloquear cuenta
    user.failedLoginAttempts = 0;
    user.accountLockedUntil = null;
    await this.userRepository.save(user);

    return {
      email: user.email,
      token: await this.getJwtToken({ id: user.id }),
    };
  }

  /**
   * Maneja los intentos fallidos de login, bloqueando la cuenta después de 3 intentos fallidos.
   * @param user El usuario que intenta iniciar sesión.
   */
  private async handleFailedLogin(user: User) {
    user.failedLoginAttempts += 1;
    console.log('user account failes atempt count: ', user.failedLoginAttempts);
    if (user.failedLoginAttempts >= 3) {
      user.accountLockedUntil = new Date(
        Math.floor(new Date().getTime() / 1000) * 1000 + 3 * 60 * 1000,
      );
    }

    await this.userRepository.save(user);
  }

  /**
   * Restablece la contraseña de un usuario validando la respuesta de seguridad.
   * @param resetPasswordDto Contiene el email, la respuesta de seguridad y la nueva contraseña.
   * @returns Un mensaje de éxito.
   * @throws BadRequestException Si la respuesta de seguridad es incorrecta.
   * @throws NotFoundException Si el usuario no existe.
   */
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

  /**
   * Obtiene la pregunta de seguridad asociada a un correo electrónico.
   * @param email El correo electrónico del usuario.
   * @returns La pregunta de seguridad.
   * @throws NotFoundException Si el usuario no existe.
   */
  async getQuestion(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return { question: user.question };
  }

  /**
   * Maneja los errores de la base de datos, proporcionando mensajes adecuados según el código del error.
   * @param error El error que ocurrió al interactuar con la base de datos.
   * @throws BadRequestException Si el error es un error de restricción (como un correo duplicado).
   * @throws InternalServerErrorException Para otros errores generales.
   */
  private handlerDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }

  /**
   * Devuelve un usuario específico por su ID.
   * @param id El ID del usuario.
   * @returns El usuario con el ID proporcionado.
   */
  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id','name','roles'],
    });
    return user;
  }

  /**
   * Devuelve un usuario específico por su correo electrónico.
   * @param email El correo electrónico del usuario.
   * @returns El usuario con el correo electrónico proporcionado.
   */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Crea los detalles de pago de un usuario, encriptando la información sensible.
   * @param createPaymentDetails Los detalles de pago a crear.
   * @returns Un objeto con los detalles de pago (enmascarados).
   * @throws Error Si no se encuentra al usuario o si ocurre un error en la creación.
   */
  async createPaymentDetail(createPaymentDetails: CreatePaymentDetailDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: createPaymentDetails.userId },
      });
      if (!user) {
        throw new Error('User not found');
      }

      // Encriptación de los detalles de pago
      const encryptedCardNumber = this.encryptData(
        createPaymentDetails.cardNumber,
      );
      const encryptedCvc = this.encryptData(createPaymentDetails.cvc);
      const encryptedExpirationDate = this.encryptData(
        createPaymentDetails.expirationDate,
      );

      // Creación de un nuevo objeto de detalles de pago
      const bankDetail = this.bank_detailsRepository.create({
        ...createPaymentDetails,
        cardNumber: encryptedCardNumber,
        cvc: encryptedCvc,
        expirationDate: encryptedExpirationDate,
      });
      await this.bank_detailsRepository.save(bankDetail);

      // Devuelve los detalles de pago enmascarados (se eliminan las partes sensibles)
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

  /**
   * Encripta los datos sensibles usando un algoritmo seguro.
   * @param data La información que se desea encriptar.
   * @returns La información encriptada.
   */
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

  /**
   * Desencripta datos previamente encriptados utilizando el algoritmo AES-256-CBC.
   * @param encryptedData Los datos encriptados que se desean desencriptar.
   * @returns La información desencriptada.
   * @throws Error Si ocurre un problema al desencriptar los datos.
   */
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

  /**
   * Enmascara el número de tarjeta de crédito, mostrando solo los últimos 4 dígitos.
   * @param cardNumber El número de tarjeta que se desea enmascarar.
   * @returns El número de tarjeta enmascarado.
   */
  private maskCardNumber(cardNumber: string): string {
    return cardNumber.replace(/\d(?=\d{4})/g, '*');
  }

  /**
   * Enmascara la fecha de expiración de una tarjeta de crédito.
   * @param expirationDate La fecha de expiración de la tarjeta en formato `MM/YY`.
   * @returns La fecha de expiración enmascarada.
   */
  private maskExpirationDate(expirationDate: string): string {
    const [year, month] = expirationDate.split('/');
    return `*${month.slice(1)}/**${year.slice(2)}`;
  }

  /**
   * Elimina los detalles de pago de un usuario específico.
   * @param userInfo El identificador del usuario (generalmente, el ID del usuario).
   * @returns Un mensaje de éxito indicando que los detalles de pago fueron eliminados.
   * @throws NotFoundException Si no se encuentran los detalles de pago para el usuario.
   */
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

  /**
   * Devuelve los detalles de pago de un usuario específico.
   * @param userInfo El identificador del usuario (generalmente, el ID del usuario).
   * @returns Un objeto con los detalles de pago, enmascarados.
   * @throws NotFoundException Si no se encuentran los detalles de pago para el usuario.
   */
  async findPaymentDetailByUser(userInfo: string) {
    const paymentDetails = await this.bank_detailsRepository.findOne({
      where: { userId: userInfo },
    });

    if (!paymentDetails) {
      throw new NotFoundException('No payment details found for this user');
    }

    return {
      cardNumber: this.maskCardNumber(
        this.decryptData(paymentDetails.cardNumber),
      ),
      cvc: '***',
      expirationDate: this.maskExpirationDate(
        this.decryptData(paymentDetails.expirationDate),
      ),
    };
  }

  /**
   * Actualiza los detalles de pago de un usuario.
   * @param updatePaymentDetailDto Los detalles de pago a actualizar.
   * @returns Un objeto con los detalles de pago actualizados.
   * @throws NotFoundException Si no se encuentra el usuario o los detalles de pago.
   */
  async updatePaymentDetail(updatePaymentDetails: UpdatePaymentDetailDto) {
    try {
      const { userId, cardNumber, cvc, expirationDate } = updatePaymentDetails;

      const existingPaymentDetail = await this.bank_detailsRepository.findOne({
        where: { userId },
      });

      if (!existingPaymentDetail) {
        throw new NotFoundException('Payment details not found for this user');
      }

      if (cardNumber) {
        existingPaymentDetail.cardNumber = this.encryptData(cardNumber);
      }

      if (cvc) {
        existingPaymentDetail.cvc = this.encryptData(cvc);
      }

      if (expirationDate) {
        existingPaymentDetail.expirationDate = this.encryptData(expirationDate);
      }

      await this.bank_detailsRepository.save(existingPaymentDetail);

      return {
        cardNumber: cardNumber ? this.maskCardNumber(cardNumber) : undefined,
        cvc: cvc ? '***' : undefined,
        expirationDate: expirationDate
          ? this.maskExpirationDate(expirationDate)
          : undefined,
      };
    } catch (error) {
      this.handlerDBErrors(error);
    }
  }
}
