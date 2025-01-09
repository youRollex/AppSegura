import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { NewMessageDto } from './dto/new-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  async saveMessage(@Body() newMessageDto: NewMessageDto) {
    return this.chatService.saveMessage(newMessageDto);
  }

  @Get('messages')
  async getAllMessages() {
    return this.chatService.getAllMessages();
  }
}
