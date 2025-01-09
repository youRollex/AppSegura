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

@Injectable()
export class CardsService {
  private readonly logger = new Logger('CardsService');

  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async create(createCardDto: CreateCardDto) {
    try {
      const card = this.cardRepository.create(createCardDto);
      await this.cardRepository.save(card);
      return card;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const cards = await this.cardRepository.find();
    return cards;
  }

  async findOne(term: string) {
    let card: Card;
    if (isUUID(term)) {
      card = await this.cardRepository.findOneBy({ id: term });
    }
    if (!card) {
      throw new NotFoundException(`Product with ${term} not found`);
    }
    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    const card = await this.cardRepository.preload({
      id,
      ...updateCardDto, // Busca el producto por el id y carga las propiedades de updateDto,
    });

    if (!card) throw new NotFoundException(`Card with ${id} not found`);

    try {
      await this.cardRepository.save(card);
      return card;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const card = await this.findOne(id);
    await this.cardRepository.remove(card);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server log',
    );
  }

  async deleteAll() {
    const query = this.cardRepository.createQueryBuilder('card');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
