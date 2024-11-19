export interface ModelService {
  async getAnswer(message: string): Promise<string | null>;
}
