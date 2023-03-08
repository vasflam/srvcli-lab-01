import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, Length, Min, Max } from 'class-validator';
import { User } from '../../users/user.entity';
import { Move } from './move.entity';

export enum GameStatus {
  CREATED = 'created',
  STARTED = 'started',
  COMPLETED = 'completed',
}

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(5, 20)
  name: string;

  @Min(3)
  @Max(8)
  @Column({ default: 3 })
  size: number = 3;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({
    name: 'owner_id',
    referencedColumnName: 'id',
  })
  owner: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({
    name: 'opponent_id',
    referencedColumnName: 'id',
  })
  opponent: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({
    name: 'winner_id',
    referencedColumnName: 'id',
  })
  winner: User;

  @Column({nullable: true, default: null})
  first: number;

  @OneToMany(() => Move, (move) => move.game, { eager: true })
  moves: Move[];

  @Column({name: 'winned_moves', type: 'json', default: '[]'})
  winnedMoves: number[] = [];

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.CREATED,
  })
  status: GameStatus;

  isCreated(): boolean {
    return this.status == GameStatus.CREATED;
  }

  isStarted(): boolean {
    return this.status == GameStatus.STARTED;
  }

  isCompleted(): boolean {
    return this.status == GameStatus.COMPLETED;
  }

  hasParticipant(uid: number) {
    if (this.owner.id == uid || this.opponent?.id == uid) {
      return true;
    }

    return false;
  }

  isOwner(uid: number) {
    return this.owner.id == uid;
  }

  isOpponent(uid: number) {
    return this.opponent?.id == uid;
  }

  isWinner(uid: number) {
    return this.winner?.id == uid;
  }

  isLooser(uid: number) {
    return this.hasParticipant(uid) && this.winner?.id != uid;
  }

  getParticipants(): number[] {
    return [this.owner.id, this.opponent?.id];
  }
}

