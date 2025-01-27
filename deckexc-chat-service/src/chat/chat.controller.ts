import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { NewMessageDto } from './dto/new-message.dto';

/**
 * Controlador para manejar las operaciones relacionadas con el chat.
 * Este controlador gestiona la creación y recuperación de mensajes de chat.
 */
@Controller('chat')
export class ChatController {
  /**
   * Constructor del controlador.
   * @constructor
   * @param {ChatService} chatService - Servicio para manejar la lógica del chat.
   */
  constructor(private readonly chatService: ChatService) {}

  /**
   * Guarda un nuevo mensaje en la base de datos.
   * @method saveMessage
   * @param {NewMessageDto} newMessageDto - DTO que contiene los datos del mensaje a guardar.
   * @returns Una promesa que resuelve con el mensaje guardado.
   */
  @Post('messages')
  async saveMessage(@Body() newMessageDto: NewMessageDto) {
    return this.chatService.saveMessage(newMessageDto);
  }

  /**
   * Obtiene todos los mensajes almacenados en la base de datos.
   * @method getAllMessages
   * @returns Una promesa que resuelve con una lista de todos los mensajes.
   */
  @Get('messages')
  async getAllMessages() {
    return this.chatService.getAllMessages();
  }
}
