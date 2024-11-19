import { Module } from '@nestjs/common';
import { SummarizerService } from './summarizer.service';
import { SummarizerController } from './summarizer.controller';
import { SummarizerGateway } from './summarizer.gateway';
import { DocxService } from './services/docx.service';
import { ModelModule } from '../model/model.module';

@Module({
  imports: [ModelModule],
  controllers: [SummarizerController],
  providers: [SummarizerGateway, DocxService],
})
export class SummarizerModule {}
