import { BadRequestException, Injectable } from '@nestjs/common';
import { OpenAIService } from '../model/openai.service';
import { Queue, Job } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { SummarizerGateway } from './summarizer.gateway';

@Injectable()
export class SummarizerDispatcher {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly gateway: SummarizerGateway,
    @InjectQueue('summarizer')
    private readonly queue: Queue,
  ) {}

  async summarizeFromText(text: string) {
    const job = await this.queue.add('text', { text });
    this.gateway.emitJobPosition(job.id, await this.getJobPosition(job));
    this.monitorJobPosition(job);
    return { message: 'Summarization request received', jobId: job.id };
  }

  private async getJobPosition(job: Job): Promise<number> {
    const waitingJobs = await this.queue.getJobs(['waiting']);
    return waitingJobs.findIndex((j) => j.id === job.id) + 1;
  }

  private async monitorJobPosition(job: Job) {
    const interval = setInterval(async () => {
      const position = await this.getJobPosition(job);
      if (position > 0) {
        this.gateway.emitJobPosition(job.id, position);
      } else {
        clearInterval(interval);
      }
    }, 5000);
  }
}
