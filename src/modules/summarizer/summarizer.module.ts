import { Module } from '@nestjs/common';
import { SummarizerService } from './summarizer.service';
import { SummarizerController } from './summarizer.controller';
import { SummarizerGateway } from './summarizer.gateway';
import { DocxService } from './services/docx.service';
import { ModelModule } from '../model/model.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ModelModule, UsersModule],
  controllers: [SummarizerController],
  providers: [SummarizerGateway, DocxService],
})
export class SummarizerModule {}
