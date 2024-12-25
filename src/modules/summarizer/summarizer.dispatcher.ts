import { Injectable } from '@nestjs/common';
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

  async submitTextSummarization(text: string, userId: string) {
    return this.submitJob(
      'text',
      { text, userId },
      userId,
      'Требование на суммирование текста получено',
    );
  }

  async submitFileSummarization(file: Express.Multer.File, userId: string) {
    return this.submitJob(
      'file',
      { file, userId },
      userId,
      'Требование на суммирование файла получено',
    );
  }

  private async submitJob(
    jobName: string,
    data: any,
    userId: string,
    successMessage: string,
  ) {
    const job = await this.queue.add(jobName, data, {
      removeOnComplete: true,
      removeOnFail: true,
    });
    const position = await this.getJobPosition(job);
    this.gateway.emitJobPosition(job.id, position, userId);
    this.trackJobPosition(job, userId);
    return { message: successMessage, jobId: job.id };
  }

  private async getJobPosition(job: Job): Promise<number> {
    const waitingJobs = await this.queue.getJobs(['waiting']);
    return waitingJobs.findIndex((j) => j.id === job.id) + 1;
  }

  private trackJobPosition(job: Job, userId: string) {
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
