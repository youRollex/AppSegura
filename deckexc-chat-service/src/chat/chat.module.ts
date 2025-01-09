import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ChatController } from './chat.controller';

@Module({
  providers: [ChatService],
  controllers: [ChatController],
  imports: [TypeOrmModule.forFeature([Message])],
  exports: [TypeOrmModule, ChatService],
})
export class ChatModule {}
