import { OfferCondition } from '../enum/offer-condition.enum';

export class Offer {
  id: string;
  userId: string;
  cardId: string;
  description: string;
  condition: OfferCondition;
  price: number;
}
