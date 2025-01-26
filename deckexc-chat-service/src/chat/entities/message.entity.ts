import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * Entidad que representa un mensaje en el sistema.
 * Contiene información sobre el contenido del mensaje, el usuario que lo envió y la fecha de creación.
 */
@Entity({ name: 'message' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column('text')
  userId: string;

  @Column('text')
  userName: string;

  @CreateDateColumn()
  createdAt: Date;
}
