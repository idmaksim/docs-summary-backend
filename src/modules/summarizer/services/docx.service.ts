import { Injectable } from '@nestjs/common';
import { SummarizerService } from '../summarizer.service';
import * as mammoth from 'mammoth';
import { OpenAIService } from 'src/modules/model/openai.service';

@Injectable()
export class DocxService implements SummarizerService {
  constructor(private readonly openaiService: OpenAIService) {}

  async summarize(buffer: Buffer) {
    const text = await this.extractRawText(buffer);
    const summary = await this.openaiService.getAnswer(text);
    return { summary };
  }

  private async extractRawText(buffer: Buffer) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
}
