import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    try {
      if (info instanceof JsonWebTokenError) {
        throw new UnauthorizedException();
      }
      return super.handleRequest(err, user, info, context, status);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
