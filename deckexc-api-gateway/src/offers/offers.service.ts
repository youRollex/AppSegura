import {
  Injectable,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OffersService {
  private readonly OFFERS_SERVICE_URL = process.env.OFFERS_SERVICE_URL;

  constructor(private readonly httpService: HttpService) {}

  async create(createOfferDto: CreateOfferDto, userId: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.OFFERS_SERVICE_URL}/offers`,
          createOfferDto,
          {
            headers: {
              'X-User-Id': userId,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  async findAll() {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.OFFERS_SERVICE_URL}/offers`),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  async findOne(term: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.OFFERS_SERVICE_URL}/offers/${term}`),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  async findOneByUser(userId: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.OFFERS_SERVICE_URL}/offers/user`, {
          headers: {
            'X-User-Id': userId,
          },
        }),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  async update(id: string, updateOfferDto: UpdateOfferDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.patch(
          `${this.OFFERS_SERVICE_URL}/offers/${id}`,
          updateOfferDto,
        ),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.delete(`${this.OFFERS_SERVICE_URL}/offers/${id}`),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  private handleHttpExceptions(error: any) {
    console.error('Error en la solicitud HTTP:');
    //throw new Error('Error en la solicitud HTTP');
  }
}
