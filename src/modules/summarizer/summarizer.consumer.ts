import { Processor, WorkerHost } from '@nestjs/bullmq';
import { OpenAIService } from '../model/openai.service';
import { Job } from 'bullmq';
import { BadRequestException, Logger } from '@nestjs/common';
import * as mammoth from 'mammoth';
import * as pdf from 'pdf-parse';
import { SummarizerGateway } from './summarizer.gateway';
import { FileTypes } from 'src/common/constants/file-types.enum';
import { GigachatService } from '../model/gigachat.service';

@Processor('summarizer')
export class SummarizerConsumer extends WorkerHost {
  private readonly logger = new Logger(SummarizerConsumer.name);

  constructor(
    private readonly gigachatService: GigachatService,
    private readonly gateway: SummarizerGateway,
  ) {
    super();
  }

  async process(job: Job) {
    const processor = this.getProcessor(job.name);
    if (!processor) {
      throw new BadRequestException('Invalid job name');
    }
    try {
      const result = await processor(job);
      this.emitCompletion(job.id, result.summary, job.data.userId);
      return result;
    } catch (error) {
      this.handleError(job.id, error);
    }
  }

  private getProcessor(jobName: string) {
    const processors: Record<string, (job: Job) => Promise<any>> = {
      text: this.processText.bind(this),
      file: this.processFile.bind(this),
    };
    return processors[jobName];
  }

  private async processText(job: Job) {
    const { text } = job.data;
    const summary = await this.gigachatService.getAnswer(text);
    return { summary };
  }

  private async processFile(job: Job) {
    const { file } = job.data;
    const text = await this.extractText(file);
    const summary = await this.gigachatService.getAnswer(text);
    return { summary };
  }

  private getFileHandler(mimetype: string) {
    const handlers: Record<
      string,
      (file: Express.Multer.File) => Promise<string>
    > = {
      [FileTypes.DOCX]: this.extractTextFromDocx.bind(this),
      [FileTypes.PDF]: this.extractTextFromPdf.bind(this),
      [FileTypes.DOC]: this.extractTextFromDocx.bind(this),
      [FileTypes.TXT]: this.extractTextFromTxt.bind(this),
    };
    return handlers[mimetype];
  }

  private async extractText(
    file: Express.Multer.File & { buffer: { data: number[]; type: string } },
  ) {
    const handler = this.getFileHandler(file.mimetype);
    if (!handler) {
      throw new BadRequestException('Invalid file type');
    }
    return handler(file);
  }

  private emitCompletion(jobId: string, summary: string, userId: string) {
    this.gateway.emitJobCompletion(jobId, summary, userId);
  }

  private handleError(jobId: string, error: any) {
    this.logger.error(error);
    this.gateway.emitJobError(jobId, error.message, '');
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

  private async extractTextFromTxt(
    file: Express.Multer.File & { buffer: { data: number[]; type: string } },
  ) {
    const buffer = Buffer.from(file.buffer.data);
    return buffer.toString();
  }
}
