import { ConfigService } from '@nestjs/config';
import { ModelService } from './model.service';
import { GigaChat } from 'gigachat-node';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GigachatService implements ModelService {
  private readonly client: GigaChat;
  constructor(private readonly configService: ConfigService) {
    this.client = new GigaChat(
      this.configService.get('AI_API_KEY'),
      true,
      true,
      true,
      false,
    );
  }

  async getAnswer(message: string) {
    const response = await this.client.summarize('Gigachat:latest', [message]);
    return response[0].object;
  }
}
