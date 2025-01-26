import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

/**
 * Servicio para manejar las operaciones relacionadas con las tarjetas.
 * Este servicio interactúa con un servicio externo de tarjetas a través de HTTP.
 * @class CardsService
 */
@Injectable()
export class CardsService {
  /**
   * URL base del servicio externo de tarjetas.
   * @private
   */
  private readonly CARDS_SERVICE_URL = process.env.CARDS_SERVICE_URL;

  /**
   * Constructor del servicio.
   * @constructor
   * @param {HttpService} httpService - Servicio HTTP para realizar solicitudes.
   */
  constructor(private readonly httpService: HttpService) {}

  /**
   * Crea una nueva tarjeta en el servicio externo.
   * @method create
   * @param {CreateCardDto} createCardDto - Datos necesarios para crear una tarjeta.
   * @returns Una promesa que resuelve con la respuesta del servicio externo.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
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

  /**
   * Obtiene todas las tarjetas del servicio externo.
   * @method findAll
   * @returns Una promesa que resuelve con la respuesta del servicio externo.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
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

  /**
   * Obtiene una tarjeta específica por su término de búsqueda (ID o nombre).
   * @method findOne
   * @param {string} term - Término de búsqueda (ID).
   * @returns Una promesa que resuelve con la respuesta del servicio externo.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
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

  /**
   * Actualiza una tarjeta existente en el servicio externo.
   * @method update
   * @param {string} id - ID de la tarjeta a actualizar.
   * @param {UpdateCardDto} updateCardDto - Datos para actualizar la tarjeta.
   * @returns Una promesa que resuelve con la respuesta del servicio externo.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
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

  /**
   * Elimina una tarjeta existente en el servicio externo.
   * @method remove
   * @param {string} id - ID de la tarjeta a eliminar.
   * @returns Una promesa que resuelve con la respuesta del servicio externo.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
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

  /**
   * Maneja las excepciones de las solicitudes HTTP.
   * @private
   * @method handleHttpExceptions
   * @param {any} error - Error capturado durante la solicitud HTTP.
   * @throws {Error} Lanza un error con un mensaje descriptivo.
   */
  private handleHttpExceptions(error: any) {
    console.error('Error en la solicitud HTTP:', error);
    throw new Error('Error en la solicitud HTTP');
  }
}
