import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SummarizerGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  public server: Server;
  private readonly logger = new Logger(SummarizerGateway.name);

  constructor() {}

  async afterInit(server: Server) {
    this.server = server;
    this.logger.debug('Initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  async emitJobPosition(jobId: string, position: number) {
    this.server.emit('position', { jobId, position });
  }

  async emitJobCompletion(jobId: string, summary: string) {
    this.server.emit('summary', { jobId, summary });
  }
}
