import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../enum/question.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text')
  name: string;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @Column({
    type: 'enum',
    enum: Question,
  })
  question: Question;

  @Column('text')
  answer: string;

  @Column('int', { default: 0 })
  failedLoginAttempts: number;    // Numero de intentos fallidos al login

  @Column({ type: 'timestamp', nullable: true })
  accountLockedUntil: number;  // Tiempo en milisegundos hasta la cual la cuenta estara bloqueada

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }
}
