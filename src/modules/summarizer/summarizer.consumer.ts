import { Processor, WorkerHost } from '@nestjs/bullmq';
import { OpenAIService } from '../model/openai.service';
import { Job } from 'bullmq';
import { BadRequestException } from '@nestjs/common';
import { FileTypes } from 'src/common/constants/file-types.enum';
import { Express } from 'express';
import { SummarizerGateway } from './summarizer.gateway';

@Processor('summarizer')
export class SummarizerConsumer extends WorkerHost {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly gateway: SummarizerGateway,
  ) {
    super();
  }

  async process(job: Job) {
    const processors: Record<string, (job: Job) => Promise<any>> = {
      text: this.processText.bind(this),
    };
    const processor = processors[job.name];
    if (!processor) {
      throw new BadRequestException('Invalid job name');
    }
    const result = await processor(job);
    this.gateway.emitJobCompletion(job.id, result.summary);
    return result;
  }

  async processText(job: Job) {
    const text = job.data.text;
    const summary = await this.openaiService.getAnswer(text);
    return { summary };
  }
}
