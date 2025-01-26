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

/**
 * Controlador para gestionar las operaciones relacionadas con las tarjetas.
 */
@Controller('cards')
export class CardsController {
  /**
   * Creación de una instancia de CardsController
   * @param {CardsService} cardsService - uso del Servicio para manejar la lógica de negocio relacionada con las tarjetas.
   */
  constructor(private readonly cardsService: CardsService) {}

  /**
   * Crea una nueva tarjeta.
   * @param {CreateCardDto} createCardDto - Objeto de transferencia de datos para crear una tarjeta.
   * @returns {Promise<any>} - La creación de la targjeta.
   */
  @Post()
  createCard(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  /**
   * Recupera todas las tarjetas.
   * @returns {Promise<any[]>} Devuelve una lista con todas las tarjetas.
   */
  @Get()
  findAllCard() {
    return this.cardsService.findAll();
  }

  /**
   * Recupera una tarjeta específica usando un término de búsqueda.
   * @param {string} term - El término de búsqueda (por nombre o ID)
   * @returns {Promise<any>} La tarjeta que coincide con el término "term" de búsqueda.
   */
  @Get(':term')
  findOneCard(@Param('term') term: string) {
    return this.cardsService.findOne(term);
  }

  /**
   * Actualiza una tarjeta por su ID o (UUID).
   * @param {string} id - El identificador único de la tarjeta (en formato UUID)
   * @param {UpdateCardDto} updateCardDto - Objeto de transferencia de datos para actualizar una tarjeta.
   * @returns {Promise<any>} - tarjeta actualizada.
   */
  @Patch(':id')
  updateCard(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.update(id, updateCardDto);
  }

  /**
   * Eliminación de una tarjeta por su ID.
   * @param {string} id - Es el identificador único de la tarjeta (en formato UUID).
   * @returns {Promise<void>} Confirma la eliminación
   */
  @Delete(':id')
  removeCard(@Param('id', ParseUUIDPipe) id: string) {
    return this.cardsService.remove(id);
  }
}
