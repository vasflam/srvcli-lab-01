import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameStatus } from './entity/game.entity';
import { Move } from './entity/move.entity';
import { User } from '../users/user.entity';
import { CreateGameRequest } from './dto/create.dto';
import {
  AlreadyInGame,
  AlreadyHostingGameException,
  GameNotFoundException,
  GameAlreadyStartedException,
  GameAlreadyCompletedException,
  NotYourMoveException,
  MoveFieldAlreadyTaken,
} from './games.exception';
import { vector2board, getBoardCombinations } from './utils';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    @InjectRepository(Move)
    private movesRepository: Repository<Move>
  ) {}

  /**
   * Find game by identificator
   */
  findGameById(id: number): Promise<Game> {
    return this.gamesRepository.findOneBy({ id });
  }

  /**
   * Find all not started games
   */
  findCreatedGames(): Promise<Game[]> {
    return this.gamesRepository.find({
      where: {
        status: GameStatus.CREATED
      }
    });
  }

  /**
   * Find created game for specified user
   */
  findCreatedGameByUser(uid: number): Promise<Game> {
    return this.gamesRepository.findOne({
      where: {
        owner: { id: uid },
        status: GameStatus.CREATED,
      },
    });
  }

  /**
   * Find a game where user participate
   */
  async findUserGame(uid: number): Promise<Game>{
    const user = {id: uid};
    return await this.gamesRepository.findOne({
      where: [
        { owner: user, status: GameStatus.CREATED },
        { owner: user, status: GameStatus.STARTED },
        { opponent: user, status: GameStatus.STARTED },
        { opponent: user, status: GameStatus.CREATED },
      ],
    });
  }

  /**
   * Check if user is in game
   */
  async userHasStartedGame(id: number): Promise<boolean> {
    const game = await this.findUserGame(id);
    if (game) {
      return true;
    }
    return false;
  }

  /**
   * Create new game
   */
  async createGame(owner: User, request: CreateGameRequest): Promise<Game> {
    const ingame = await this.userHasStartedGame(owner.id);

    if (ingame) {
      throw new AlreadyInGame();
    }
    const game = this.gamesRepository.create({
      owner,
      ...request,
    });

    const saved = await this.gamesRepository.save(game);
    return this.findGameById(saved.id);
  }

  /**
   * Join to game
   */
  async joinGame(id: number, uid: number): Promise<Game> {
    const hasGame = await this.userHasStartedGame(uid);
    if (hasGame) {
      throw new AlreadyInGame();
    }

    const game = await this.gamesRepository.findOneBy({ id });
    if (!game) {
      throw new GameNotFoundException();
    }

    if (game.isStarted() || game.opponent != null) {
      throw new GameAlreadyStartedException();
    }

    const participants = [game.owner.id, uid];
    game.first = participants[Math.floor(Math.random() * participants.length)]
    //game.first = 1;
    game.status = GameStatus.STARTED;
    game.opponent = {id: uid} as User;
    const saved = await this.gamesRepository.save(game);
    return this.findGameById(saved.id);
  }

  /**
   * Leave game
   */
  async leaveGame(uid: number) {
    const game = await this.findUserGame(uid);
    if (!game) {
      throw new GameNotFoundException();
    }

    if (game.isCompleted()) {
      throw new GameAlreadyCompletedException();
    }

    // Creator can cancel created game
    if (game.isCreated() && game.isOwner(uid)) {
      this.gamesRepository.remove(game);
      return;
    }

    // Complete game if it started
    if (game.isStarted()) {
      const winner = game.owner.id == uid
        ? game.opponent.id
        : game.owner.id;
    }
  }

  /**
   * @param id number Game identificator
   * @param winner number User id
   */
  async completeGame(id: number, winner: number): Promise<Game> {
    const game = await this.findGameById(id);
    if (!game.hasParticipant(winner)) {
      throw new GameNotFoundException();
    }

    if (game.isCompleted()) {
      throw new GameAlreadyCompletedException();
    }

    game.status = GameStatus.COMPLETED;
    game.winner = { id: winner } as User;
    return this.gamesRepository.save(game);
  }

  /**
   * Player cancel created game when game not started
   */
  async cancelGame(uid: number): Promise<boolean> {
    const game = await this.findCreatedGameByUser(uid);
    if (game && game.isCreated()) {
      await this.gamesRepository.remove(game);
      return true;
    }

    return false;
  }

  /**
   * Make turn, game is searched by user
   */
  async makeMove(uid: number, x: number, y: number): Promise<Game> {
    const game = await this.findUserGame(uid);
    if (!game) {
      throw new GameNotFoundException();
    }

    const { moves } = game;
    // Check first turn
    if ((moves.length == 0 && game.first != uid)
        || (moves.length > 0 && moves[moves.length-1].user.id == uid)
       ) {
      throw new NotYourMoveException();
    }

    // Check if x,y is already set
    const xy = moves.filter(move => move.x == x && move.y == y).length;
    if (xy) {
      throw new MoveFieldAlreadyTaken();
    }

    const move = this.movesRepository.create({
      game,
      user: {id: uid} as User,
      x,
      y,
    });
    await this.movesRepository.save(move);
    moves.push(move);

    // check if game is complete
    // search horizontal

    const winCount = game.size < 5 ? 3: 5;
    const winPattern = [...Array(winCount).keys()];
    const board = vector2board(game.size, moves);
    const variants = getBoardCombinations(winCount, board);
    let winner = null;
    let winnedMoves = [];
    for (const variant of variants) {
      const filtered = variant.filter(v => !!v);
      const map = filtered.map(v => v.user_id).join('');
      const participants = game.getParticipants();
      for (const id of participants) {
        const pattern = Array(winCount).fill(id).join('');
        if (map.includes(pattern)) {
          winner = id;
          winnedMoves = filtered.map(v => v.id);
          break;
        }
      }
    }

    if (winner) {
      game.winner = { id: winner } as User;
      game.winnedMoves = winnedMoves;
      game.status = GameStatus.COMPLETED;
      await this.gamesRepository.save(game);
    }

    return await this.findGameById(game.id);
  }
}
