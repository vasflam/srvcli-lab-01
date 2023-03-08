import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, Length, Min, Max } from 'class-validator';
import { Game } from './game.entity'; 
import { User } from '../../users/user.entity';

@Entity('moves')
export class Move {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game, (game) => game.moves)
  @JoinColumn({
    name: 'game_id',
    referencedColumnName: 'id',
  })
  game: Game;

  @ManyToOne(() => User, {eager: true})
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;

  @Column()
  user_id: number;

  @Column()
  x: number;

  @Column()
  y: number;

  toJSON() {
    const { user, game, ...rest } = this;
    return rest;
  }
}
