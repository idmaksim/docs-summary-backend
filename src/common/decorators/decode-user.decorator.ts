import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../types/user';

export const DecodeUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);
