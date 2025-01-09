import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OfferCondition } from '../enum/offer-condition.enum';

@Entity({ name: 'offer' })
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  userId: string;

  @Column('text')
  cardId: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: OfferCondition,
  })
  condition: OfferCondition;

  @Column('float', {
    default: 0,
  })
  price: number;
}
