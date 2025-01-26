import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { NewMessageDto } from './dto/new-message.dto';
import { Message } from './entities/message.entity';

/**
 * Servicio para manejar la lógica relacionada con el chat.
 * Este servicio interactúa con servicios externos para obtener datos de usuarios y gestionar mensajes.
 * @class ChatService
 */
@Injectable()
export class ChatService {
  /**
   * URL base del servicio de chat.
   * @private
   */
  private readonly CHAT_SERVICE_URL = process.env.CHAT_SERVICE_URL;
  /**
   * URL base del servicio de autenticación.
   * @private
   */
  private readonly AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

  /**
   * Obtiene los datos de un usuario desde el servicio de autenticación.
   * @method getUserData
   * @param {string} userId - El ID del usuario.
   * @returns {Promise<any>} Una promesa que resuelve con los datos del usuario.
   * @throws {Error} Si ocurre un error al realizar la solicitud HTTP.
   */
  async getUserData(userId: string): Promise<any> {
    const { data } = await axios.get(
      `${this.AUTH_SERVICE_URL}/auth/users/${userId}`,
    );
    return data;
  }

  /**
   * Guarda un mensaje en el servicio de chat.
   * @method saveMessage
   * @param {string} userId - El ID del usuario que envía el mensaje.
   * @param {string} userName - El nombre del usuario que envía el mensaje.
   * @param {NewMessageDto} newMessageDto - Los datos del mensaje a guardar.
   * @returns {Promise<any>} Una promesa que resuelve con la respuesta del servicio de chat.
   * @throws {Error} Si ocurre un error al realizar la solicitud HTTP.
   */
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

  /**
   * Obtiene todos los mensajes del servicio de chat.
   * @method getAllMessages
   * @returns {Promise<Message[]>} Una promesa que resuelve con la lista de mensajes.
   * @throws {Error} Si ocurre un error al realizar la solicitud HTTP.
   */
  async getAllMessages(): Promise<Message[]> {
    const { data } = await axios.get(`${this.CHAT_SERVICE_URL}/chat/messages`);
    return data;
  }
}
