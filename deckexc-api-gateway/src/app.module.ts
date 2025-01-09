import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './cards/cards.module';
import { OffersModule } from './offers/offers.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CardsModule,
    OffersModule,
    ChatModule,
  ],
})
export class AppModule {}
