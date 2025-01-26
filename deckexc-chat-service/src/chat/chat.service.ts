import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { NewMessageDto } from './dto/new-message.dto';
import axios from 'axios';

/**
 * Servicio para manejar las operaciones relacionadas con el chat.
 * Este servicio gestiona el almacenamiento y la recuperación de mensajes en una base de datos.
 */
@Injectable()
export class ChatService {
  /**
   * Constructor del servicio.
   * @constructor
   * @param {Repository<Message>} messageRepository - Repositorio de TypeORM para manejar la entidad de mensajes.
   */
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  /**
   * Guarda un nuevo mensaje en la base de datos.
   * @method saveMessage
   * @param {NewMessageDto} newMessageDto - DTO que contiene los datos del mensaje a guardar.
   * @returns Una promesa que resuelve con el mensaje guardado.
   * @throws {Error} Si ocurre un error durante el proceso de guardado.
   */
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

  /**
   * Obtiene todos los mensajes almacenados en la base de datos.
   * @method getAllMessages
   * @returns Retorna una lista de mensajes ordenados por fecha de creación en orden ascendente.
   */
  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

   /**
   * Maneja las excepciones relacionadas con la base de datos.
   * @private
   * @method handleDBExceptions
   * @param {any} error - El error capturado durante una operación de base de datos.
   * @throws {Error} Lanza un error con un mensaje descriptivo dependiendo del código del error.
   */
  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new Error(error.detail);
    throw new Error('Unexpected error, check server log');
  }
}
