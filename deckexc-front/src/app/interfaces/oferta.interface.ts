import { CardInterface } from "./card.interface";
import { User } from "./user.interface";

export interface OffersInterface{
  description: string;
  condition: string;
  price: number;
  user: User;
  card: CardInterface;
  id: string;
}
