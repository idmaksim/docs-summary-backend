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
    this.logger.debug('Инициализировано');
  }

  private async getUser(client: Socket) {
    const token = this.extractToken(client);
    this.logger.debug(`Токен: ${token}`);
    if (token) {
      try {
        const payload = await this.tokenService.verifyAccessToken(token);
        return this.usersService.findOneById(payload.id, false, false);
      } catch (error) {
        this.logger.error(`Ошибка проверки токена: ${error}`);
        this.emitError(client, 'Неверный токен');
        client.disconnect();
      }
    }
  }

  private extractToken(client: Socket): string | undefined {
    return client.handshake.headers.authorization?.split(' ')[1];
  }

  private emitError(client: Socket, message: string) {
    client.emit('error', { message });
  }

  async handleConnection(client: Socket) {
    this.logger.debug(`Клиент подключен: ${client.id}`);
    const user = await this.getUser(client);
    if (user) {
      this.logger.debug(
        `Клиент ${client.id} присоединился к комнате ${user.id}`,
      );
      client.join(user.id);
      return;
    }
    this.logger.error('Неверный токен');
    this.emitError(client, 'Неверный токен');
    client.disconnect();
  }

  async handleDisconnect(client: Socket) {
    const user = await this.getUser(client);
    if (user) {
      this.logger.debug(`Клиент ${client.id} покинул комнату ${user.id}`);
      client.leave(user.id);
    }
    this.logger.debug(`Клиент отключен: ${client.id}`);
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
