import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from '../auth/interfaces';
import { ChatService } from './chat.service';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  private connectedClients: {
    [id: string]: { socket: Socket; userId: string; userName: string };
  } = {};

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayLoad;
    try {
      payload = this.jwtService.verify(token);
      await this.registerClient(client, payload.id);

      const messages = await this.chatService.getAllMessages();
      client.emit(
        'all-messages',
        await Promise.all(
          messages.map(async (msg) => ({
            name: msg.userName,
            message: msg.content,
          })),
        ),
      );
    } catch (error) {
      client.disconnect();
      return;
    }
    this.wss.emit('clients-updated', this.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  async handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    const message = await this.chatService.saveMessage(
      this.connectedClients[client.id].userId,
      this.connectedClients[client.id].userName,
      payload,
    );

    this.wss.emit('message-from-server', {
      name: message.userName,
      message: message.content,
    });
  }

  handleDisconnect(client: Socket) {
    this.removeClient(client.id);
    this.wss.emit('clients-updated', this.getConnectedClients());
  }

  private async registerClient(client: Socket, userId: string) {
    try {
      const user = await this.chatService.getUserData(userId);
      if (!user) throw new Error('User not found');

      this.checkUserConnection(user.id);
      this.connectedClients[client.id] = {
        socket: client,
        userId: user.id,
        userName: user.name,
      };
    } catch (error) {
      client.disconnect();
    }
  }

  private removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  private checkUserConnection(userId: string) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];
      if (connectedClient.userId === userId) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }
}
