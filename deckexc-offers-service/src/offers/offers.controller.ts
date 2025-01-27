import {
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Headers,
} from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';
import { UpdateOfferDto } from './dto/update-offer.dto';

/**
 * Controlador para gestionar las ofertas.
 * Proporciona endpoints para crear, obtener, actualizar y eliminar ofertas.
 */
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

   /**
   * Crea una nueva oferta.
   * @param {CreateOfferDto} createOfferDto - Datos para la creación de la oferta.
   * @param {string} userId - ID del usuario autenticado obtenido de los encabezados.
   * @returns {Promise<Offer>} La oferta creada.
   */
  @Post()
  createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Headers('X-User-Id') userId: string,
  ) {
    return this.offersService.create(createOfferDto, userId);
  }

  /**
   * Obtiene todas las ofertas registradas.
   * @returns {Promise<any[]>} Lista de ofertas con detalles adicionales.
   */
  @Get()
  findAllOffer() {
    return this.offersService.findAll();
  }

  /**
   * Obtiene las ofertas de un usuario específico.
   * @param {string} userId - ID del usuario autenticado obtenido de los encabezados.
   * @returns {Promise<any[]>} Lista de ofertas pertenecientes al usuario.
   */
  @Get('user')
  findOneOfferByUser(@Headers('X-User-Id') userId: string) {
    return this.offersService.findOneByUser(userId);
  }

  /**
   * Busca una oferta por su identificador o término.
   * @param {string} term - Identificador único o término de búsqueda de la oferta.
   * @returns {Promise<any>} La oferta encontrada con detalles adicionales.
   */
  @Get(':term')
  findOneOffer(@Param('term') term: string) {
    return this.offersService.findOne(term);
  }

  /**
   * Actualiza una oferta existente.
   * @param {string} id - Identificador único de la oferta a actualizar.
   * @param {UpdateOfferDto} updateOfferDto - Datos de la oferta a actualizar.
   * @returns {Promise<Offer>} La oferta actualizada.
   */
  @Patch(':id')
  updateOffer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    return this.offersService.update(id, updateOfferDto);
  }

   /**
   * Elimina una oferta por su identificador.
   * @param {string} id - Identificador único de la oferta a eliminar.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  removeOffer(@Param('id', ParseUUIDPipe) id: string) {
    return this.offersService.remove(id);
  }
}
