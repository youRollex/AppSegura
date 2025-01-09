import { Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [OffersController],
  providers: [OffersService],
  imports: [HttpModule, AuthModule],
  exports: [OffersService],
})
export class OffersModule {}
