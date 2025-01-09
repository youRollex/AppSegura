import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthModule } from 'src/auth/auth.module';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatService, ChatGateway],
  imports: [AuthModule],
  exports: [ChatService],
})
export class ChatModule {}
