export interface SummarizerService {
  summarize(buffer: Buffer): Promise<{ summary: string } | null>;
}
