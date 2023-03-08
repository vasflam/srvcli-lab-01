import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ALLOW_GUEST_KEY } from './allow-guest.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const allowGuest = this.reflector.getAllAndOverride<boolean>(ALLOW_GUEST_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (allowGuest) {
      return true;
    }

    return super.canActivate(context);
  }
}
