import {
  Injectable,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

/**
 * Servicio para manejar las operaciones relacionadas con las ofertas.
 * Este servicio interactúa con un servicio externo de ofertas a través de HTTP.
 * @class OffersService
 */
@Injectable()
export class OffersService {

    /**
   * URL base del servicio externo de ofertas.
   * @private
   */
  private readonly OFFERS_SERVICE_URL = process.env.OFFERS_SERVICE_URL;

    /**
   * Constructor del servicio.
   * @constructor
   * @param {HttpService} httpService - Servicio HTTP para realizar solicitudes.
   */
  constructor(private readonly httpService: HttpService) {}

   /**
   * Crea una nueva oferta en el servicio externo.
   * @method create
   * @param {CreateOfferDto} createOfferDto - Los datos necesarios para crear una oferta.
   * @param {string} userId - El ID del usuario autenticado.
   * @returns Una promesa que resuelve con la oferta creada del servicio externo.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
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

   /**
   * Obtiene todas las ofertas del servicio externo.
   * @method findAll
   * @returns Una promesa que resuelve con la lista de ofertas del servicio externo.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
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

    /**
   * Obtiene una oferta específica por su término de búsqueda (ID).
   * @method findOne
   * @param {string} term - El término de búsqueda (ID).
   * @returns Una promesa que resuelve con la oferta encontrada del servicio externo.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
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

   /**
   * Obtiene las ofertas asociadas a un usuario específico.
   * @method findOneByUser
   * @param {string} userId - El ID del usuario autenticado.
   * @returns Una promesa que resuelve con las ofertas del usuario del servicio externo.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
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

   /**
   * Actualiza una oferta existente en el servicio externo.
   * @method update
   * @param {string} id - El ID de la oferta a actualizar.
   * @param {UpdateOfferDto} updateOfferDto - Los datos para actualizar la oferta del servicio externo.
   * @returns Una promesa que resuelve con la oferta actualizada.
   * @throws {Error} Si ocurre un error en la solicitud HTTP.
   */
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

 /**
   * Maneja las excepciones de las solicitudes HTTP.
   * @private
   * @method handleHttpExceptions
   * @param {any} error - El error capturado durante la solicitud HTTP.
   * @throws {Error} Lanza un error con un mensaje descriptivo.
   */
  private handleHttpExceptions(error: any) {
    console.error('Error en la solicitud HTTP:', error);
    throw new Error('Error en la solicitud HTTP');
  }
}
