import { Injectable } from '@nestjs/common';
import { SummarizerService } from '../summarizer.service';
import * as pdfParse from 'pdf-parse';
import { OpenAIService } from 'src/modules/model/openai.service';

@Injectable()
export class PdfService implements SummarizerService {
  constructor(private readonly openaiService: OpenAIService) {}

  async summarize(buffer: Buffer) {
    const text = await this.extractRawText(buffer);
    const summary = await this.openaiService.getAnswer(text);
    return { summary };
  }

  private async extractRawText(buffer: Buffer) {
    const result = await pdfParse(buffer);
    return result.text;
  }
}
