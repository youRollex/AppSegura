import { Question } from '../enum/question.enum';

export class User {
  id: string;
  email: string;
  password: string;
  name: string;
  roles: string[];
  question: Question;
  answer: string;
}
