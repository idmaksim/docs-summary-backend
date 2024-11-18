import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
