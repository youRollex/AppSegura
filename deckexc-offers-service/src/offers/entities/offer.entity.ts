import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OfferCondition } from '../enum/offer-condition.enum';
 
/**
 * Entidad que representa una oferta en la base de datos.
 * Define la estructura de la tabla `offer` y sus columnas correspondientes.
 */
@Entity({ name: 'offer' })
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @Column('text', { nullable: false })
  userId: string;  // Asegurar que no sea nulo
 
  @Column('text', { nullable: false })
  cardId: string;  // Asegurar que no sea nulo
 
  @Column('varchar', { length: 500, nullable: false })
  description: string;
 
  @Column({
    type: 'enum',
    enum: OfferCondition,
  })
  condition: OfferCondition;
 
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
  })
  @Check(`"price" > 0`)  // Asegura que el valor sea mayor a 0
  price: number;  // Definir precisión para evitar errores de redondeo en cálculos monetarios
}