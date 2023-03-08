import { Controller, Request, Get, Post, Body } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameRequest } from './dto/create.dto';

@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService
  ) {}
}
