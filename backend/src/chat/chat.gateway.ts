import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ChatService } from './chat.service';
import { CreateMessageRequest } from './chat.dto';
import { Chat } from './chat.entity';

@WebSocketGateway({
  cors: true,
  transports: ['websocket'],
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {}

  /**
   */
  async handleConnection(socket: Socket) {
    const user = await this.authService.getUserFromSocket(socket);
    if (!user) {
      socket.emit('exception', {
        error: 400,
        message: 'Unauthorized',
      });
      socket.disconnect();
    }
    socket.broadcast.emit('enterChat', user);

    const users = this.getOnlineUsers().map(u => ({
      id: u.id,
      username: u.username,
    }));
    const messages = await this.chatService.getLastMessages(user.id, 100);
    socket.emit('init', {
      users,
      messages,
    });
  }

  /**
   */
  async handleDisconnect(socket: Socket) {
    const user = await this.authService.getUserFromSocket(socket);
    socket.broadcast.emit('leaveChat', user);
  }

  /**
   */
  getOnlineUsers() {
      const sockets = (this.server.sockets as any).values();
      const online = [];
      for (const socket of sockets) {
        const { sub, username } = this.authService.decodeToken(socket.handshake?.auth?.token);
        online.push({ id: sub, username, socket, });
      }
      return online;
  }

  /**
   */
  @SubscribeMessage('message')
  async createMessage(@MessageBody() data: CreateMessageRequest, @ConnectedSocket() socket: Socket): Promise<Chat> {
    const user = await this.authService.getUserFromSocket(socket);
    data['from'] = user.id;
    const message = await this.chatService.createMessage(data);

    const online = this.getOnlineUsers();
    if (message.isPrivate) {
      // find recipients
      online.filter(u => [message.to, message.from].includes(u.id)) .map(u => {
        return u.socket.emit('message', message);
      });
    } else {
      online.filter(u => ![message.to, message.from].includes(u.id)).map(u => {
        return u.socket.emit('message', message);
      });
      //socket.broadcast.emit('message', message);
    }

    return message;
  }
}
