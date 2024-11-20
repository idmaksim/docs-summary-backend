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
import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';

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

  constructor(
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {}

  async afterInit(server: Server) {
    this.server = server;
    this.logger.debug('Initialized');
  }

  private async getUserFromClient(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];
    this.logger.debug(`Token: ${token}`);
    if (token) {
      try {
        const payload = await this.tokenService.verifyAccessToken(token);
        return this.usersService.findOneById(payload.id, false, false);
      } catch (error) {
        this.logger.error(`Error verifying token: ${error}`);
        client.emit('error', { message: 'Invalid token' });
        client.disconnect();
      }
    }
  }

  async handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
    const user = await this.getUserFromClient(client);
    if (user) {
      this.logger.debug(`Client ${client.id} joined room ${user.id}`);
      client.join(user.id);
      return;
    }
    this.logger.error('Invalid token');
    client.emit('error', { message: 'Invalid token' });
    client.disconnect();
  }

  async handleDisconnect(client: Socket) {
    const user = await this.getUserFromClient(client);
    if (user) {
      this.logger.debug(`Client ${client.id} left room ${user.id}`);
      client.leave(user.id);
    }
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  async emitJobPosition(jobId: string, position: number, userId: string) {
    this.server.to(userId).emit('position', { jobId, position });
  }

  async emitJobCompletion(jobId: string, summary: string, userId: string) {
    this.server.to(userId).emit('summary', { jobId, summary });
  }

  async emitJobError(jobId: string, error: string, userId: string) {
    this.server.to(userId).emit('error', { jobId, error });
  }
}
