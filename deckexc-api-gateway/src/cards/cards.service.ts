import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CardsService {
  private readonly CARDS_SERVICE_URL = process.env.CARDS_SERVICE_URL;

  constructor(private readonly httpService: HttpService) {}

  async create(createCardDto: CreateCardDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.CARDS_SERVICE_URL}/cards`, createCardDto),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  async findAll() {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.CARDS_SERVICE_URL}/cards`),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  async findOne(term: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.CARDS_SERVICE_URL}/cards/${term}`),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.patch(
          `${this.CARDS_SERVICE_URL}/cards/${id}`,
          updateCardDto,
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
        this.httpService.delete(`${this.CARDS_SERVICE_URL}/cards/${id}`),
      );
      return response.data;
    } catch (error) {
      this.handleHttpExceptions(error);
    }
  }

  private handleHttpExceptions(error: any) {
    console.error('Error en la solicitud HTTP:', error);
    throw new Error('Error en la solicitud HTTP');
  }
}
