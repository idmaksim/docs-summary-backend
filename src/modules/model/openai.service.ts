import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ModelService as ModelServiceInterface } from './model.service';
import { PROMPTS } from 'src/common/constants/prompts.enum';

@Injectable()
export class OpenAIService implements ModelServiceInterface {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    try {
      this.openai = new OpenAI({
        apiKey: configService.get('AI_API_KEY'),
        baseURL: configService.get('AI_API_URL'),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getAnswer(message: string) {
    const prompt = PROMPTS.AI_PROMPT.replace('{data}', message);
    try {
      const answer = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o-mini',
      });
      const fullAnswer = answer.choices[0].message.content;
      return fullAnswer;
    } catch (error) {
      return null;
    }
  }
}
