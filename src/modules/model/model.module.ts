import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { GigachatService } from './gigachat.service';

@Module({
  providers: [OpenAIService, GigachatService],
  exports: [OpenAIService, GigachatService],
})
export class ModelModule {}
