import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const start = new Date();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.debug(
            `END [${method}] ${url} ${new Date().getTime() - start.getTime()}ms`,
          ),
        ),
      );
  }
}
