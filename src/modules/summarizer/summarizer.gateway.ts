import { BadRequestException, Injectable } from '@nestjs/common';
import { FileTypes } from 'src/common/constants/file-types.enum';
import { SummarizerService } from './summarizer.service';
import { DocxService } from './services/docx.service';
import { OpenAIService } from '../model/openai.service';
import { PdfService } from './services/pdf.service';

@Injectable()
export class SummarizerGateway {
  constructor(
    private readonly docxService: DocxService,
    private readonly openaiService: OpenAIService,
    private readonly pdfService: PdfService,
  ) {}

  async summarizeFromFile(file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const handlers: Record<FileTypes, SummarizerService> = {
      [FileTypes.DOCX]: this.docxService,
      [FileTypes.PDF]: this.pdfService,
    };
    const handler = handlers[file.mimetype];
    if (!handler) {
      throw new BadRequestException('Unsupported file type');
    }
    return handler.summarize(file.buffer);
  }

  async summarizeFromText(text: string) {
    const summary = await this.openaiService.getAnswer(text);
    return { summary };
  }
}
