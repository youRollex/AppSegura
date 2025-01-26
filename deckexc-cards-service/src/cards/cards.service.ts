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
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

/**
 * Servicio para manejar la lógica de negocio relacionada con las tarjetas.
 */
@Injectable()
export class CardsService {
  /**
   * Logger para registrar eventos e información de depuración.
   */
  private readonly logger = new Logger('CardsService');

  /**
   * Constructor del servicio CardsService.
   * @param {Repository<Card>} cardRepository - Repositorio para gestionar las operaciones de la entidad Card.
   */
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  /**
   * Crea una nueva carta.
   * @param {CreateCardDto} createCardDto - Objeto de transferencia de datos para crear una tarjeta.
   * @returns {Promise<Card>} La creación de la tarjeta.
   * @throws {InternalServerErrorException} Si ocurre un error inesperado en la base de datos.
   */
  async create(createCardDto: CreateCardDto): Promise<Card> {
    try {
      const card = this.cardRepository.create(createCardDto);
      await this.cardRepository.save(card);
      return card;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  /**
   * Recupera todas las tarjetas.
   * @returns {Promise<Card[]>} Retorna una lista de todas las tarjetas
   */
  async findAll(): Promise<Card[]> {
    const cards = await this.cardRepository.find();
    return cards;
  }

  /**
   * Recupera una tarjeta específica por término de búsqueda.
   * @param {string} term - El término de búsqueda (ID o nombre).
   * @returns {Promise<Card>} La tarjeta encontrada.
   * @throws {NotFoundException} Si no se encuentra ninguna tarjeta con el término proporcionado.
   */
  async findOne(term: string): Promise<Card> {
    let card: Card;
    if (isUUID(term)) {
      card = await this.cardRepository.findOneBy({ id: term });
    }
    if (!card) {
      throw new NotFoundException(`Card with term ${term} not found`);
    }
    return card;
  }

  /**
   * Actualiza una tarjeta existente por su ID.
   * @param {string} id - El identificador único de la tarjeta
   * @param {UpdateCardDto} updateCardDto - Objeto de transferencia de datos para actualizar una tarjeta.
   * @returns {Promise<Card>} La tarjeta actualizada.
   * @throws {NotFoundException} Si no se encuentra ninguna tarjeta con el ID proporcionado tira una excepción.
   * @throws {InternalServerErrorException} Si ocurre un error inesperado en la base de datos manda una excepción.
   */
  async update(id: string, updateCardDto: UpdateCardDto): Promise<Card> {
    const card = await this.cardRepository.preload({
      id,
      ...updateCardDto,
    });

    if (!card) throw new NotFoundException(`Card with ID ${id} not found`);

    try {
      await this.cardRepository.save(card);
      return card;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  /**
   * Elimina una tarjeta por su iD.
   * @param {string} id - El identificador único de la tarjeta
   * @returns {Promise<void>} Confirmación de la eliminación de la tarjeta.
   * @throws {NotFoundException} Si no se encuentra ninguna tarjeta con el ID proporcionado manda una exceción.
   */
  async remove(id: string): Promise<void> {
    const card = await this.findOne(id);
    await this.cardRepository.remove(card);
  }

  /**
   * Maneja excepciones específicas relacionadas con la base de datos.
   * @param {any} error - El error generado por la operación en la base de datos.
   * @throws {BadRequestException} Si el error está relacionado con una violación de restricciones ( por duplicidad).
   * @throws {InternalServerErrorException} Para cualquier otro error inesperado.
   */
  private handleDBExceptions(error: any): void {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server log',
    );
  }

  /**
   * Elimina todas las tarjetas de la base de datos.
   * @returns {Promise<void>} Confirmación de la eliminación de todas las tarjetas.
   * @throws {InternalServerErrorException} Si ocurre un error inesperado en la base de datos manda excepción.
   */
  async deleteAll(): Promise<void> {
    const query = this.cardRepository.createQueryBuilder('card');
    try {
      await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}