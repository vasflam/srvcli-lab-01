import { IsNotEmpty, Length } from 'class-validator';

export class CreateUserRequest {
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @IsNotEmpty()
  @Length(6, 128)
  password: string;
}

