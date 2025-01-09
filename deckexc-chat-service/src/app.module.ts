import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';

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
      host: process.env.DB_HOST_CHAT,
      port: +process.env.DB_PORT_CHAT,
      database: process.env.DB_NAME_CHAT,
      username: process.env.DB_USERNAME_CHAT,
      password: process.env.DB_PASSWORD_CHAT,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ChatModule,
  ],
})
export class AppModule {}
