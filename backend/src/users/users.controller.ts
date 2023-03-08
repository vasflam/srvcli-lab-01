import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dto/create.dto';
import { User } from './user.entity';
import { AllowGuest } from '../auth/allow-guest.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @AllowGuest()
  create(@Body() req: CreateUserRequest): Promise<User> {
    return this.usersService.create(req);
  }
}

