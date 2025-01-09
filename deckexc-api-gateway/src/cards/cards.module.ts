import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports: [HttpModule, AuthModule],
  exports: [CardsService],
})
export class CardsModule {}
