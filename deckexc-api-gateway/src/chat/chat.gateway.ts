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

/**
 * Gateway para manejar la conexión y comunicación en tiempo real mediante WebSockets.
 * Este gateway gestiona la conexión de clientes, la autenticación y el envío/recepción de mensajes.
 * @class ChatGateway
 * @implements {OnGatewayConnection}
 * @implements {OnGatewayDisconnect}
 */
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  /**
   * Instancia del servidor de WebSocket.
   * @type {Server}
   */
  @WebSocketServer() wss: Server;

  /**
   * Diccionario para almacenar los clientes conectados.
   * La clave es el ID del socket y el valor es un objeto con el socket, el ID del usuario y el nombre del usuario.
   * @private
   * @type {{ [id: string]: { socket: Socket; userId: string; userName: string } }}
   */
  private connectedClients: {
    [id: string]: { socket: Socket; userId: string; userName: string };
  } = {};

  /**
   * Constructor del gateway.
   * @constructor
   * @param {ChatService} chatService - Servicio para manejar la lógica del chat.
   * @param {JwtService} jwtService - Servicio para manejar la autenticación JWT.
   */
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Maneja la conexión de un nuevo cliente.
   * Verifica el token JWT, registra al cliente y envía los mensajes existentes.
   * @method handleConnection
   * @param {Socket} client - El socket del cliente que se conecta.
   */
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayLoad;
    try {
      payload = this.jwtService.verify(token);
      await this.registerClient(client, payload.id);

      // Enviar todos los mensajes al cliente recién conectado
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
    // Notificar a todos los clientes sobre la actualización de la lista de clientes conectados
    this.wss.emit('clients-updated', this.getConnectedClients());
  }

  /**
   * Maneja los mensajes enviados por los clientes.
   * Guarda el mensaje en la base de datos y lo retransmite a todos los clientes.
   * @method handleMessageFromClient
   * @param {Socket} client - El socket del cliente que envía el mensaje.
   * @param {NewMessageDto} payload - El contenido del mensaje.
   */
  @SubscribeMessage('message-from-client')
  async handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    const message = await this.chatService.saveMessage(
      this.connectedClients[client.id].userId,
      this.connectedClients[client.id].userName,
      payload,
    );

    // Retransmitir el mensaje a todos los clientes
    this.wss.emit('message-from-server', {
      name: message.userName,
      message: message.content,
    });
  }

  /**
   * Maneja la desconexión de un cliente.
   * Elimina al cliente de la lista de clientes conectados y notifica a los demás clientes.
   * @method handleDisconnect
   * @param {Socket} client - El socket del cliente que se desconecta.
   */
  handleDisconnect(client: Socket) {
    this.removeClient(client.id);
    this.wss.emit('clients-updated', this.getConnectedClients());
  }

  /**
   * Registra un cliente en la lista de clientes conectados.
   * @private
   * @method registerClient
   * @param {Socket} client - El socket del cliente.
   * @param {string} userId - El ID del usuario autenticado.
   */
  private async registerClient(client: Socket, userId: string) {
    try {
      const user = await this.chatService.getUserData(userId);
      if (!user) throw new Error('User not found');

      // Verificar si el usuario ya está conectado y desconectarlo si es necesario
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

  /**
   * Elimina un cliente de la lista de clientes conectados.
   * @private
   * @method removeClient
   * @param {string} clientId - El ID del socket del cliente.
   */
  private removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  /**
   * Verifica si un usuario ya está conectado y lo desconecta si es necesario.
   * @private
   * @method checkUserConnection
   * @param {string} userId - El ID del usuario.
   */
  private checkUserConnection(userId: string) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];
      if (connectedClient.userId === userId) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }

  /**
   * Obtiene la lista de IDs de los clientes conectados.
   * @method getConnectedClients
   * @returns {string[]} Un arreglo con los IDs de los clientes conectados.
   */
  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }
}
