import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl:
          process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST_CARDS,
      port: +process.env.DB_PORT_CARDS,
      database: process.env.DB_NAME_CARDS,
      username: process.env.DB_USERNAME_CARDS,
      password: process.env.DB_PASSWORD_CARDS,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CardsModule,
  ],
})
export class AppModule {}
