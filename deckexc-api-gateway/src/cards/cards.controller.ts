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

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @Auth()
  createCard(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Get()
  @Auth()
  findAllCard() {
    return this.cardsService.findAll();
  }

  @Get(':term')
  @Auth()
  findOneCard(@Param('term') term: string) {
    return this.cardsService.findOne(term);
  }

  @Patch(':id')
  @Auth()
  updateCard(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.update(id, updateCardDto);
  }

  @Delete(':id')
  @Auth()
  removeCard(@Param('id', ParseUUIDPipe) id: string) {
    return this.cardsService.remove(id);
  }
}
