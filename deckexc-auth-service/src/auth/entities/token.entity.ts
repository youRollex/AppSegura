import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('token_revoke')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  jti: string; 

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; 
}