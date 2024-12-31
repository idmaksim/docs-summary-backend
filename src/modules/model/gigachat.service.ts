import { ConfigService } from '@nestjs/config';
import { ModelService } from './model.service';
import { Injectable } from '@nestjs/common';
import { PROMPTS } from 'src/common/constants/prompts.enum';

@Injectable()
export class GigachatService implements ModelService {
  constructor(private readonly configService: ConfigService) {}

  async getAnswer(message: string) {
    const token = await this.getToken();
    const prompt = await this.getPrompt(message);
    const response = await fetch(this.configService.get('GIGACHAT_BASE_URL'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: 'follow',
      credentials: 'include',
      body: JSON.stringify({
        model: 'GigaChat',
        messages: [
          { role: 'system', content: '' },
          {
            created_at: 1735642301,
            role: 'user',
            content: prompt.trim().replace(/\n/g, ' '),
            attachments: [],
          },
        ],
        profanity_check: true,
      }),
    });
    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async getPrompt(message: string) {
    return PROMPTS.AI_PROMPT.replace('{data}', message);
  }

  private async getToken() {
    const response = await fetch(this.configService.get('GIGACHAT_AUTH_URL'), {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.configService.get('GIGACHAT_API_KEY')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        RqUID: this.configService.get('GIGACHAT_REQUEST_ID'),
      },
      body: 'scope=GIGACHAT_API_PERS',
    });
    if (!response.ok) {
      throw response;
    }
    const data = await response.json();
    return data.access_token;
  }
}
