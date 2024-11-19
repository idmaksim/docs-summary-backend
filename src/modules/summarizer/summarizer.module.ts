import { Module } from '@nestjs/common';
import { SummarizerDispatcher } from './summarizer.dispatcher';
import { ModelModule } from '../model/model.module';
import { UsersModule } from '../users/users.module';
import { SummarizerGateway } from './summarizer.gateway';
import { SummarizerConsumer } from './summarizer.consumer';
import { BullModule } from '@nestjs/bullmq';
import { SummarizerController } from './summarizer.controller';

@Module({
  imports: [
    ModelModule,
    UsersModule,
    BullModule.registerQueue({
      name: 'summarizer',
    }),
  ],
  controllers: [SummarizerController],
  providers: [SummarizerDispatcher, SummarizerGateway, SummarizerConsumer],
})
export class SummarizerModule {}
