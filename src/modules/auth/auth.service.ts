import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../password/password.service';
import { TokenService } from '../token/token.service';
import { User } from 'src/common/types/user';
import { RefreshDto } from './dto/refresh.dto';
import { UserErrors } from 'src/common/constants/errors/user.errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
  ) {}

  async refresh(refreshDto: RefreshDto) {
    const decoded = await this.tokenService.verifyRefreshToken(
      refreshDto.refreshToken,
    );
    return this.combineTokens(decoded.id);
  }

  async signIn(signInDto: SignInDto) {
    const user = (await this.usersService.findOneByUsername(
      signInDto.username,
      true,
    )) as User;
    const isPasswordValid = await this.passwordService.comparePassword(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(UserErrors.INVALID_PASSWORD);
    }
    return this.combineTokens(user.id);
  }

  async signUp(signUpDto: SignUpDto) {
    const user = await this.usersService.create(signUpDto);
    return this.combineTokens(user.id);
  }

  async combineTokens(id: string) {
    const accessToken = await this.tokenService.generateAccessToken(id);
    const refreshToken = await this.tokenService.generateRefreshToken(id);
    return { accessToken, refreshToken };
  }
}
