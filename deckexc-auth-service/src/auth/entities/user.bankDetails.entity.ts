import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';

/**
 * Entidad que representa los detalles bancarios del usuario.
 * Esta entidad se utiliza para almacenar información relacionada con la tarjeta bancaria.
*/  

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