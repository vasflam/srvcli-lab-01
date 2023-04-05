import { Length } from 'class-validator';

export class CreateMessageRequest {
  from?: number;

  to?: number;

  @Length(1, 1000)
  message: string;

  isPrivate?: boolean;
}
