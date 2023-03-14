import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { GamesService } from './games.service';
import { CreateGameRequest } from './dto/create.dto';

@WebSocketGateway({
  cors: true,
  transports: ['websocket'],
  namespace: 'games',
})
export class GamesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private gamesService: GamesService
  ) {}

  async getUserFromSocket(socket: Socket) {
    const token = socket.handshake?.auth?.token;
    const user = await this.authService.validateToken(token);
    return user;
  }

  async handleConnection(client: Socket) {
    const user = await this.getUserFromSocket(client);
    if (!user) {
      client.emit('exception', {
        error: 400,
        message: 'Unauthorized',
      });
      client.disconnect();
    }

    const [game, stats] = await Promise.all([
      this.gamesService.findUserGame(user.id),
      this.gamesService.getUserStats(user.id),
    ]);


    client.emit('init', {
      game,
      stats,
    });
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.getUserFromSocket(socket);
    /*
    const canceled = await this.gamesService.cancelGameForUser(user.id);
    if (canceled) {
      socket.broadcast.emit('hideGame', canceled);
    }
    */
  }

  @SubscribeMessage('gameStats')
  async gameStats(@ConnectedSocket() socket: any): Promise<any> {
    const user = await this.getUserFromSocket(socket);
    const stats = await this.gamesService.getUserStats(user.id);
    return {
      event: 'gameStats',
      data: stats,
    }
  }

  @SubscribeMessage('listGames')
  async listGames(@ConnectedSocket() socket: any): Promise<any> {
    const games = await this.gamesService.findCreatedGames();
    return {
      event: 'listGames',
      data: games,
    }
  }

  @SubscribeMessage('createGame')
  async createGame(@MessageBody() data: CreateGameRequest, @ConnectedSocket() socket: any): Promise<any> {
    const user = await this.getUserFromSocket(socket);
    try {
      const game = await this.gamesService.createGame(user, data);
      const event = {
        event: 'createGame',
        data: game,
      };

      const games = await this.gamesService.findCreatedGames();
      socket.broadcast.emit('listGames', games);
      return {
        event: 'createGame',
        data: game,
      }
    } catch (e) {
      console.log(e);
      return {
        event: 'createGame',
        data: {
          success: false,
          message: e,
        },
      }
    }
  }

  @SubscribeMessage('cancelGame')
  async cancelGame(@ConnectedSocket() socket: Socket): Promise<any> {
    const user = await this.getUserFromSocket(socket);
    const canceled = await this.gamesService.cancelGame(user.id);
    const games = await this.gamesService.findCreatedGames();
    socket.broadcast.emit('listGames', games);

    return {
      event: 'cancelGame',
      data: {
        success: canceled,
      },
    };
  }

  @SubscribeMessage('joinGame')
  async joinGame(@MessageBody() msg: any, @ConnectedSocket() socket: Socket): Promise<any> {
    const user = await this.getUserFromSocket(socket);
    try {
      const game = await this.gamesService.joinGame(msg.id, user.id);
      const sockets = (this.server.sockets as any).values();
      for (const socket of sockets) {
        const id = this.authService.getUserIdFromToken(socket.handshake?.auth?.token);
        const participants = game.getParticipants();

        const promises = [];
        if (id && participants.includes(id)) {
          promises.push(socket.emit('startGame', game));
        }
        await Promise.all(promises);
      }
    } catch(e) {
      return {
        event: 'joinGame',
        data: {
          success: false,
          message: e,
        },
      };
    }
  }

  @SubscribeMessage('gameMove')
  async turn(@MessageBody() msg: any, @ConnectedSocket() socket: Socket): Promise<any> {
    const user = await this.getUserFromSocket(socket);
    try {
      const {x, y} = msg;
      const game = await this.gamesService.makeMove(user.id, x, y);
      const sockets = (this.server.sockets as any).values();
      const promises = [];
      for (const socket of sockets) {
        const id = this.authService.getUserIdFromToken(socket.handshake?.auth?.token);
        const participants = game.getParticipants();
        if (id && participants.includes(id)) {
          const stats = await this.gamesService.getUserStats(id);
          promises.push(socket.emit('gameMove', game));
          promises.push(socket.emit('gameStats', stats));
        }
      }
      await Promise.all(promises);
    } catch(e) {
      console.log(e);
      return {
        event: 'gameMove',
        data: {
          success: false,
          message: e,
        },
      };
    }
  }
}
