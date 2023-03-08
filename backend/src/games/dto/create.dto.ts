import { IsNotEmpty, Length, Min, Max } from 'class-validator';

export class CreateGameRequest {
  @IsNotEmpty()
  @Length(5, 20)
  name: string;

  @Min(3)
  @Max(8)
  size: number;
}
