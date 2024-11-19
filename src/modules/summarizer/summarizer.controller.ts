import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SummarizerGateway } from './summarizer.gateway';
import { Express } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SummarizeTextDto } from './dto/summarize-text.dto';

@Controller('summarizer')
@ApiTags('Summarizer')
export class SummarizerController {
  constructor(private readonly summarizerGateway: SummarizerGateway) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async summarizeFromFile(@UploadedFile() file: Express.Multer.File) {
    return this.summarizerGateway.summarizeFromFile(file);
  }

  @Post('text')
  async summarizeFromText(@Body() body: SummarizeTextDto) {
    return this.summarizerGateway.summarizeFromText(body.text);
  }
}
