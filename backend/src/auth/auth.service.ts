import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new UnauthorizedException();
    }

    const v = await bcrypt.compare(password, user.password)
    if (!v) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async validateToken(token: string): Promise<User> {
    const payload = this.jwtService.decode(token);
    if (payload) {
      const user = this.usersService.findOneById(payload.sub);
      if (user) {
        return user;
      }
    }

    return null;
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  getUserIdFromToken(token: string): number {
    const payload = this.decodeToken(token);
    if (payload) {
      return payload.sub;
    }
    return null;
  }

  async login(user: any) {
    return {
      id: user.id,
      username: user.username,
      access_token: this.jwtService.sign({
        sub: user.id,
        username: user.username,
      }),
    };
  }

  async getUserFromSocket(socket: Socket) {
    const token = socket.handshake?.auth?.token;
    return await this.validateToken(token);
  }
}
