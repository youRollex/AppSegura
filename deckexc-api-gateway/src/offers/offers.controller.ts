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

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @Auth()
  createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @GetUser() userId: string,
  ) {
    return this.offersService.create(createOfferDto, userId);
  }

  @Get()
  @Auth()
  findAllOffer() {
    return this.offersService.findAll();
  }

  @Get('user')
  @Auth()
  findOneOfferByUser(@GetUser() userId: string) {
    return this.offersService.findOneByUser(userId);
  }

  @Get(':term')
  @Auth()
  findOneOffer(@Param('term') term: string) {
    return this.offersService.findOne(term);
  }

  @Patch(':id')
  @Auth()
  updateOffer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    return this.offersService.update(id, updateOfferDto);
  }

  @Delete(':id')
  @Auth()
  removeOffer(@Param('id', ParseUUIDPipe) id: string) {
    return this.offersService.remove(id);
  }
}
