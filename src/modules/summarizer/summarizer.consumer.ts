import { Processor, WorkerHost } from '@nestjs/bullmq';
import { OpenAIService } from '../model/openai.service';
import { Job } from 'bullmq';
import { BadRequestException, Logger } from '@nestjs/common';
import * as mammoth from 'mammoth';
import * as pdf from 'pdf-parse';
import { SummarizerGateway } from './summarizer.gateway';
import { FileTypes } from 'src/common/constants/file-types.enum';

@Processor('summarizer')
export class SummarizerConsumer extends WorkerHost {
  private readonly logger = new Logger(SummarizerConsumer.name);

  constructor(
    private readonly openaiService: OpenAIService,
    private readonly gateway: SummarizerGateway,
  ) {
    super();
  }

  async process(job: Job) {
    const processors: Record<string, (job: Job) => Promise<any>> = {
      text: this.processText.bind(this),
      file: this.processFile.bind(this),
    };
    const processor = processors[job.name];
    if (!processor) {
      throw new BadRequestException('Invalid job name');
    }
    try {
      const result = await processor(job);
      this.gateway.emitJobCompletion(job.id, result.summary, job.data.userId);
      return result;
    } catch (error) {
      this.logger.error(error);
      this.gateway.emitJobError(job.id, error.message, job.data.userId);
    }
  }

  async processText(job: Job) {
    const text = job.data.text;
    const summary = await this.openaiService.getAnswer(text);
    return { summary };
  }

  async processFile(job: Job) {
    const { file } = job.data;
    const handlers: Record<
      string,
      (file: Express.Multer.File) => Promise<string>
    > = {
      [FileTypes.DOCX]: this.extractTextFromDocx.bind(this),
      [FileTypes.PDF]: this.extractTextFromPdf.bind(this),
      [FileTypes.DOC]: this.extractTextFromDocx.bind(this),
    };
    const handler = handlers[file.mimetype];
    if (!handler) {
      throw new BadRequestException('Invalid file type');
    }
    const text = await handler(file);
    const summary = await this.openaiService.getAnswer(text);
    return { summary };
  }

  private async extractTextFromDocx(
    file: Express.Multer.File & { buffer: { data: number[]; type: string } },
  ) {
    const buffer = Buffer.from(file.buffer.data);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  private async extractTextFromPdf(
    file: Express.Multer.File & { buffer: { data: number[]; type: string } },
  ) {
    const buffer = Buffer.from(file.buffer.data);
    const result = await pdf(buffer);
    return result.text;
  }
}
