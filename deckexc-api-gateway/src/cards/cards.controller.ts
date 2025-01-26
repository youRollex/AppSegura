import {
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Controller, Get } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Auth } from 'src/auth/decorators';

/**
 * Controlador para manejar las operaciones relacionadas con las tarjetas.
 * @class CardsController
 */
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  /**
   * Crea una nueva tarjeta.
   * @method createCard
   * @param {CreateCardDto} createCardDto - Los datos necesarios para crear una tarjeta.
   * @returns Una promesa que resuelve con la tarjeta creada.
   */
  @Post()
  @Auth()
  createCard(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  /**
   * Obtiene todas las tarjetas existentes.
   * @method findAllCard
   * @returns Una promesa que resuelve con un arreglo de todas las tarjetas.
   */
  @Get()
  @Auth()
  findAllCard() {
    return this.cardsService.findAll();
  }

  /**
   * Obtiene una tarjeta específica por su término de búsqueda (ID o nombre).
   * @method findOneCard
   * @param {string} term - El término de búsqueda (ID o nombre de la tarjeta).
   * @returns Una promesa que resuelve con la tarjeta encontrada.
   */
  @Get(':term')
  @Auth()
  findOneCard(@Param('term') term: string) {
    return this.cardsService.findOne(term);
  }

  /**
   * Actualiza una tarjeta existente por su ID.
   * @method updateCard
   * @param {string} id - El ID de la tarjeta a actualizar.
   * @param {UpdateCardDto} updateCardDto - Los datos para actualizar la tarjeta.
   * @returns Una promesa que resuelve con la tarjeta actualizada.
   */
  @Patch(':id')
  @Auth()
  updateCard(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.update(id, updateCardDto);
  }

  /**
   * Elimina una tarjeta existente por su ID.
   * @method removeCard
   * @param {string} id - El ID de la tarjeta a eliminar.
   * @returns Una promesa que resuelve cuando la tarjeta ha sido eliminada.
   */
  @Delete(':id')
  @Auth()
  removeCard(@Param('id', ParseUUIDPipe) id: string) {
    return this.cardsService.remove(id);
  }
}
