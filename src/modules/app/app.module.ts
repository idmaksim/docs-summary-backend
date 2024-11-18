import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import config from 'src/config/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] })],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
