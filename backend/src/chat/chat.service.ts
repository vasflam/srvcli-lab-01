import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Chat, ChatType } from './chat.entity';
import { CreateMessageRequest } from './chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>
  ) {}

  async getLastMessages(uid: number, take: number): Promise<Chat[]> {
    const messages = await this.chatRepository.find({
      order: { id: 'DESC' },
      take,
      where: [
        {
          type: In([ChatType.PUBLIC, ChatType.SYSTEM_PUBLIC]),
        },
        {
          type: In([ChatType.PRIVATE, ChatType.SYSTEM_PRIVATE]),
          from: { id: uid },
        },
        {
          type: In([ChatType.PRIVATE, ChatType.SYSTEM_PRIVATE]),
          to: { id: uid },
        },
      ],
    });

    return messages.reverse();
  }

  async createMessage(input: CreateMessageRequest): Promise<Chat> {
    const { from, to, message, isPrivate } = input;
    const type = !!to && isPrivate ? ChatType.PRIVATE : ChatType.PUBLIC;
    const data = {
      type,
      from: {id: from},
      message,
    };
    if (to) {
      data['to'] = {id: to};
    }
    const model = this.chatRepository.create(data);
    const saved = await this.chatRepository.save(model);
    return this.chatRepository.findOneBy({id: saved.id});
  }
}
