import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { SignUpDto } from '../auth/dto/sign-up.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: SignUpDto) {
    return this.prismaService.user.create({
      data,
    });
  }

  async findOneByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: { username },
    });
  }

  async existsByUsername(username: string) {
    const user = await this.prismaService.user.findFirst({
      where: { username },
      select: { id: true },
    });
    return !!user;
  }

  async findOneById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }
}
