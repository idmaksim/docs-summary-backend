import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue, Job } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { SummarizerGateway } from './summarizer.gateway';

@Injectable()
export class SummarizerDispatcher {
  constructor(
    private readonly gateway: SummarizerGateway,
    @InjectQueue('summarizer')
    private readonly queue: Queue,
  ) {}

  async summarizeFromText(text: string, userId: string) {
    const job = await this.queue.add(
      'text',
      { text, userId },
      { removeOnComplete: true, removeOnFail: true },
    );
    this.gateway.emitJobPosition(
      job.id,
      await this.getJobPosition(job),
      userId,
    );
    this.monitorJobPosition(job, userId);
    return { message: 'Summarization request received', jobId: job.id };
  }

  async summarizeFromFile(file: Express.Multer.File, userId: string) {
    const job = await this.queue.add(
      'file',
      { file, userId },
      { removeOnComplete: true, removeOnFail: true },
    );
    this.gateway.emitJobPosition(
      job.id,
      await this.getJobPosition(job),
      userId,
    );
    this.monitorJobPosition(job, userId);
    return { message: 'Summarization request received', jobId: job.id };
  }

  private async getJobPosition(job: Job): Promise<number> {
    const waitingJobs = await this.queue.getJobs(['waiting']);
    const index = waitingJobs.findIndex((j) => j.id === job.id) + 1;
    return index;
  }

  private async monitorJobPosition(job: Job, userId: string) {
    const interval = setInterval(async () => {
      const position = await this.getJobPosition(job);
      if (position > 0) {
        this.gateway.emitJobPosition(job.id, position, userId);
      } else {
        clearInterval(interval);
      }
    }, 100);
  }
}
