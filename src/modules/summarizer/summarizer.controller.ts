import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SummarizerDispatcher } from './summarizer.dispatcher';
import { Express } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SummarizeTextDto } from './dto/summarize-text.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';
import { DecodeUser } from 'src/common/decorators/decode-user.decorator';

@Controller('summarizer')
@ApiTags('Summarizer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SummarizerController {
  constructor(private readonly summarizerDispatcher: SummarizerDispatcher) {}

  @Post('text')
  async summarizeFromText(
    @Body() body: SummarizeTextDto,
    @DecodeUser() user: User,
  ) {
    return this.summarizerDispatcher.summarizeFromText(body.text, user.id);
  }

  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The file to summarize',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async summarizeFromFile(
    @UploadedFile() file: Express.Multer.File,
    @DecodeUser() user: User,
  ) {
    return this.summarizerDispatcher.summarizeFromFile(file, user.id);
  }
}
