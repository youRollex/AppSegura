import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';

@Entity('bank_details')
export class BankDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('text',{unique:true})
  cardNumber: string;

  @Column('text')
  cvc: string;

  @Column('text')
  expirationDate: string;
}