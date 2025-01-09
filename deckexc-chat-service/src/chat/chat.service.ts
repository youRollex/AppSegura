import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { NewMessageDto } from './dto/new-message.dto';
import axios from 'axios';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async saveMessage(newMessageDto: NewMessageDto) {
    try {
      const message = this.messageRepository.create({
        content: newMessageDto.message,
        userId: newMessageDto.userId,
        userName: newMessageDto.userName,
      });
      await this.messageRepository.save(message);
      return message;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new Error(error.detail);
    throw new Error('Unexpected error, check server log');
  }
}
