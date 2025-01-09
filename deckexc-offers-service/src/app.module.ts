import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersModule } from './offers/offers.module';

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
      host: process.env.DB_HOST_OFFERS,
      port: +process.env.DB_PORT_OFFERS,
      database: process.env.DB_NAME_OFFERS,
      username: process.env.DB_USERNAME_OFFERS,
      password: process.env.DB_PASSWORD_OFFERS,
      autoLoadEntities: true,
      synchronize: true,
    }),
    OffersModule,
  ],
})
export class AppModule {}
