import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { GamesService } from './games.service';
import { Game } from './entity/game.entity';
import { Move } from './entity/move.entity';
import { GamesController } from './games.controller';
import { GamesGateway } from './games.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, Move]),
    AuthModule,
  ],
  providers: [
    GamesService, GamesGateway
  ],
  controllers: [GamesController]
})
export class GamesModule {}
