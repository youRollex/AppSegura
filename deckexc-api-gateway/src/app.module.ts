import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './cards/cards.module';
import { OffersModule } from './offers/offers.module';
import { ChatModule } from './chat/chat.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/log-interceptor.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CardsModule,
    OffersModule,
    ChatModule,
  ],
  providers:[
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ]
})
export class AppModule {}
