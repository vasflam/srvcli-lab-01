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
import { User } from '../users/user.entity';

export enum ChatType {
  SYSTEM_PUBLIC = 'system_public',
  SYSTEM_PRIVATE = 'system_private',
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({
    name: 'owner_id',
    referencedColumnName: 'id',
  })
  from: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({
    name: 'opponent_id',
    referencedColumnName: 'id',
  })
  to: User;

  @Column({
    type: 'enum',
    enum: ChatType,
    default: ChatType.SYSTEM_PUBLIC,
  })
  type: ChatType;

  @Column()
  @Length(1, 1000)
  message: string;

  isSystemPublic() {
    return this.type == ChatType.SYSTEM_PUBLIC;
  }

  isSystemPrivate() {
    return this.type == ChatType.SYSTEM_PRIVATE;
  }

  isPublic() {
    return this.type == ChatType.PUBLIC;
  }

  isPrivate() {
    return this.type == ChatType.PRIVATE;
  }

  isOwner(uid: number) {
    return this.from?.id == uid;
  }

  isRecipient(uid: number) {
    return this.to?.id == uid;
  }
}
