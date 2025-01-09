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

@Injectable()
export class OffersService {
  private readonly logger = new Logger('OffersService');
  private readonly AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
  private readonly CARDS_SERVICE_URL = process.env.CARDS_SERVICE_URL;

  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

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

  async remove(id: string) {
    const offer = await this.findOne(id);
    await this.offerRepository.remove(offer);
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server log',
    );
  }
}
