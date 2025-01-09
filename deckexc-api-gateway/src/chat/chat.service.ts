import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { NewMessageDto } from './dto/new-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  private readonly CHAT_SERVICE_URL = process.env.CHAT_SERVICE_URL;
  private readonly AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

  async getUserData(userId: string): Promise<any> {
    const { data } = await axios.get(
      `${this.AUTH_SERVICE_URL}/auth/users/${userId}`,
    );
    return data;
  }

  async saveMessage(
    userId: string,
    userName: string,
    newMessageDto: NewMessageDto,
  ) {
    const { data } = await axios.post(
      `${this.CHAT_SERVICE_URL}/chat/messages`,
      {
        ...newMessageDto,
        userId,
        userName,
      },
    );
    return data;
  }

  async getAllMessages(): Promise<Message[]> {
    const { data } = await axios.get(`${this.CHAT_SERVICE_URL}/chat/messages`);
    return data;
  }
}
