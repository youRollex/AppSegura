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

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Headers('X-User-Id') userId: string,
  ) {
    return this.offersService.create(createOfferDto, userId);
  }

  @Get()
  findAllOffer() {
    return this.offersService.findAll();
  }

  @Get('user')
  findOneOfferByUser(@Headers('X-User-Id') userId: string) {
    return this.offersService.findOneByUser(userId);
  }

  @Get(':term')
  findOneOffer(@Param('term') term: string) {
    return this.offersService.findOne(term);
  }

  @Patch(':id')
  updateOffer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    return this.offersService.update(id, updateOfferDto);
  }

  @Delete(':id')
  removeOffer(@Param('id', ParseUUIDPipe) id: string) {
    return this.offersService.remove(id);
  }
}
