import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import axios from 'axios';

/**
 * Servicio para la gestión de ofertas.
 * Proporciona métodos CRUD y de integración con servicios externos.
 */
@Injectable()
export class OffersService {
  private readonly logger = new Logger('OffersService');
  private readonly AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
  private readonly CARDS_SERVICE_URL = process.env.CARDS_SERVICE_URL;

  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  /**
   * Crea una nueva oferta.
   * @param {CreateOfferDto} createOfferDto - Datos para crear una oferta.
   * @param {string} userId - ID del usuario que crea la oferta.
   * @returns {Promise<Offer>} La oferta creada.
   */
  async create(createOfferDto: CreateOfferDto, userId: string) {
    try {
      const offer = this.offerRepository.create({
        ...createOfferDto,
        userId: userId,
      });
      await this.offerRepository.save(offer);
      return offer;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  /**
   * Obtiene todas las ofertas con detalles de usuario y tarjeta.
   * @returns {Promise<any[]>} Lista de ofertas con datos adicionales.
   */
  async findAll() {
    const offers = await this.offerRepository.find();
    const offersWithDetails = []
    for (const offer of offers){
      const card = await this.getCardById(offer.cardId);
      const user = await this.getUserById(offer.userId);
      offersWithDetails.push({
        ...offer, user, card
      });
    }
    return offersWithDetails;
  }

  /**
   * Busca una oferta por ID o término.
   * @param {string} term - ID de la oferta o término de búsqueda.
   * @returns {Promise<any>} La oferta encontrada con detalles de usuario y tarjeta.
   * @throws {NotFoundException} Si la oferta no se encuentra.
   */
  async findOne(term: string) {
    let offer: Offer;
    if (isUUID(term)) {
      offer = await this.offerRepository.findOneBy({ id: term });
    }
    if (!offer) {
      throw new NotFoundException(`Offer with ${term} not found`);
    }
    const user = await this.getUserById(offer.userId);
    const card = await this.getCardById(offer.cardId);
    return { ...offer, user, card };
  }

  /**
   * Obtiene las ofertas de un usuario específico.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<any[]>} Lista de ofertas con detalles adicionales.
   */
  async findOneByUser(userId: string) {
    const offers = await this.offerRepository.find({
      where: { userId },
    });
    const offersWithDetails = await Promise.all(
      offers.map(async (offer) => {
        const user = await this.getUserById(offer.userId);
        const card = await this.getCardById(offer.cardId);
        return { ...offer, user, card };
      }),
    );
    return offersWithDetails;
  }

  /**
   * Obtiene información de usuario desde el servicio externo de autenticación.
   * @private
   * @param {string} userId - ID del usuario.
   * @returns {Promise<any>} Datos del usuario.
   * @throws {InternalServerErrorException} Si ocurre un error al obtener los datos.
   */
  private async getUserById(userId: string) {
    try {
      const { data } = await axios.get(
        `${this.AUTH_SERVICE_URL}/auth/users/${userId}`,
      );
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  /**
   * Obtiene información de una tarjeta desde el servicio externo de tarjetas.
   * @private
   * @param {string} cardId - ID de la tarjeta.
   * @returns {Promise<any>} Datos de la tarjeta.
   * @throws {InternalServerErrorException} Si ocurre un error al obtener los datos.
   */
  private async getCardById(cardId: string) {
    try {
      console.log(`${this.CARDS_SERVICE_URL}/cards/${cardId}`);
      const { data } = await axios.get(
        `${this.CARDS_SERVICE_URL}/cards/${cardId}`,
      );
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching card');
    }
  }

  /**
   * Actualiza una oferta existente.
   * @param {string} id - ID de la oferta a actualizar.
   * @param {UpdateOfferDto} updateOfferDto - Datos para actualizar la oferta.
   * @returns {Promise<Offer>} La oferta actualizada.
   * @throws {NotFoundException} Si la oferta no existe.
   */
  async update(id: string, updateOfferDto: UpdateOfferDto) {
    const offer = await this.offerRepository.preload({
      id,
      ...updateOfferDto,
    });

    if (!offer) throw new NotFoundException(`Offer with ${id} not found`);

    try {
      await this.offerRepository.save(offer);
      return offer;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  /**
   * Elimina una oferta por su ID.
   * @param {string} id - ID de la oferta a eliminar.
   * @returns {Promise<void>}
   */
  async remove(id: string) {
    const offer = await this.findOne(id);
    await this.offerRepository.remove(offer);
  }

  /**
   * Maneja excepciones de la base de datos y registra el error.
   * @private
   * @param {any} error - Error capturado durante la operación.
   * @throws {InternalServerErrorException} Siempre lanza una excepción de error interno.
   */
  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server log',
    );
  }
}
