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
import { Auth, GetUser } from 'src/auth/decorators';

/**
 * Controlador para manejar las operaciones relacionadas con las ofertas.
 * Este controlador gestiona la creación, consulta, actualización y eliminación de ofertas.
 * @class OffersController
 */
@Controller('offers')
export class OffersController {
  /**
   * Constructor del controlador.
   * @constructor
   * @param {OffersService} offersService - Servicio para manejar la lógica de las ofertas.
   */
  constructor(private readonly offersService: OffersService) {}

  /**
   * Crea una nueva oferta.
   * @method createOffer
   * @param {CreateOfferDto} createOfferDto - Los datos necesarios para crear una oferta.
   * @param {string} userId - El ID del usuario autenticado.
   * @returns Una promesa que resuelve con la oferta creada.
   */
  @Post()
  @Auth()
  createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @GetUser() userId: string,
  ) {
    return this.offersService.create(createOfferDto, userId);
  }

  /**
   * Obtiene todas las ofertas existentes.
   * @method findAllOffer
   * @returns Una promesa que resuelve con la lista de ofertas.
   */
  @Get()
  @Auth()
  findAllOffer() {
    return this.offersService.findAll();
  }

  /**
   * Obtiene las ofertas asociadas a un usuario específico.
   * @method findOneOfferByUser
   * @param {string} userId - El ID del usuario autenticado.
   * @returns Una promesa que resuelve con las ofertas del usuario.
   */
  @Get('user')
  @Auth()
  findOneOfferByUser(@GetUser() userId: string) {
    return this.offersService.findOneByUser(userId);
  }

  /**
   * Obtiene una oferta específica por su término de búsqueda (ID).
   * @method findOneOffer
   * @param {string} term - El término de búsqueda (ID).
   * @returns Una promesa que resuelve con la oferta encontrada.
   */
  @Get(':term')
  @Auth()
  findOneOffer(@Param('term') term: string) {
    return this.offersService.findOne(term);
  }

  /**
   * Actualiza una oferta existente por su ID.
   * @method updateOffer
   * @param {string} id - El ID de la oferta a actualizar.
   * @param {UpdateOfferDto} updateOfferDto - Los datos para actualizar la oferta.
   * @returns Una promesa que resuelve con la oferta actualizada.
   */
  @Patch(':id')
  @Auth()
  updateOffer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    return this.offersService.update(id, updateOfferDto);
  }

  /**
   * Elimina una oferta existente por su ID.
   * @method removeOffer
   * @param {string} id - El ID de la oferta a eliminar.
   * @returns Una promesa que resuelve con la oferta eliminada.
   */
  @Delete(':id')
  @Auth()
  removeOffer(@Param('id', ParseUUIDPipe) id: string) {
    return this.offersService.remove(id);
  }
}
