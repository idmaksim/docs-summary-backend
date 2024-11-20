import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { PasswordService } from '../password/password.service';
import { User, UserWithoutPassword } from '../../common/types/user';
import { UserErrors } from '../../common/constants/errors/user.errors';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async create(signUpDto: SignUpDto) {
    await this.ensureExistsByUsername(signUpDto.username);
    const hashedPassword = await this.passwordService.hashPassword(
      signUpDto.password,
    );
    return this.usersRepository.create({
      ...signUpDto,
      password: hashedPassword,
    });
  }

  async findOneByUsername(
    username: string,
    includePassword = false,
  ): Promise<UserWithoutPassword | User> {
    const user = await this.usersRepository.findOneByUsername(username);
    await this.ensureUserNotNull(user);
    return includePassword ? user : this.excludePassword(user);
  }

  async findOneById(
    id: string,
    includePassword = false,
    catchError = true,
  ): Promise<UserWithoutPassword | User> {
    const user = await this.usersRepository.findOneById(id);
    if (catchError) {
      await this.ensureUserNotNull(user);
    }
    return includePassword ? user : this.excludePassword(user);
  }

  private async ensureExistsByUsername(username: string) {
    const exists = await this.usersRepository.existsByUsername(username);
    if (exists) {
      throw new ConflictException(UserErrors.ALREADY_EXISTS);
    }
  }

  private async ensureUserNotNull(user: User) {
    if (!user) {
      throw new NotFoundException(UserErrors.NOT_FOUND);
    }
  }

  private async excludePassword(user: User): Promise<UserWithoutPassword> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private async ensureExistsByUuid(uuid: string) {
    const user = await this.usersRepository.findOneById(uuid);
    if (!user) {
      throw new NotFoundException(UserErrors.NOT_FOUND);
    }
  }
}
