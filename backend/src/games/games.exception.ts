import { BadRequestException } from '@nestjs/common';

export class AlreadyHostingGameException extends BadRequestException {
  constructor(message?: string) {
    super(message || 'User already hosting a game');
    this.name = "AlreadyHostingGameException";
  }
}

export class AlreadyInGame extends BadRequestException {
  constructor(message?: string) {
    super(message || 'User already participating in game');
    this.name = "AlreadyInGame";
  }
}

export class GameNotFoundException extends BadRequestException {
  constructor(message?: string) {
    super(message || 'The game not found');
    this.name = 'GameNotFoundException';
  }
}

export class GameAlreadyStartedException extends BadRequestException {
  constructor(message?: string) {
    super(message || 'The game has been already started');
    this.name = 'GameAlreadyStartedException';
  }
}

export class GameAlreadyCompletedException extends BadRequestException {
  constructor(message?: string) {
    super(message || 'The game has been already completed');
    this.name = 'GameAlreadyCompletedException';
  }
}

export class NotYourMoveException extends BadRequestException {
  constructor(message?: string) {
    super(message || 'Not your move.');
    this.name = 'NotYourMoveException';
  }
}

export class MoveFieldAlreadyTaken extends BadRequestException {
  constructor(message?: string) {
    super(message || 'This field is already taken.');
    this.name = 'MoveFieldAlreadyTaken';
  }
}
