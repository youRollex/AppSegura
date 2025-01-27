import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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
  
  @Column('text', { length: 500 })
  description: string;  // Limitar la longitud de la descripción para evitar ataques de almacenamiento
  
  @Column({
    type: 'enum',
    enum: OfferCondition,
  })
  condition: OfferCondition;

  @Column({
    type: 'float',
    default: 0,
    precision: 10,
    scale: 2,
  })
  price: number;  // Definir precisión para evitar errores de redondeo en cálculos monetarios
}
