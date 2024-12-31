import { Module } from '@nestjs/common';
import { GigachatService } from './gigachat.service';

@Module({
  providers: [GigachatService],
  exports: [GigachatService],
})
export class ModelModule {}
