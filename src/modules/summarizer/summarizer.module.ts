import { Module } from '@nestjs/common';
import { SummarizerDispatcher } from './summarizer.dispatcher';
import { ModelModule } from '../model/model.module';
import { UsersModule } from '../users/users.module';
import { SummarizerGateway } from './summarizer.gateway';
import { SummarizerConsumer } from './summarizer.consumer';
import { BullModule } from '@nestjs/bullmq';
import { SummarizerController } from './summarizer.controller';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    ModelModule,
    UsersModule,
    BullModule.registerQueue({
      name: 'summarizer',
    }),
    TokenModule,
  ],
  controllers: [SummarizerController],
  providers: [SummarizerDispatcher, SummarizerGateway, SummarizerConsumer],
})
export class SummarizerModule {}
