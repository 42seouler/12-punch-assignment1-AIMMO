import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @ApiProperty({ description: 'The name of a userId.' })
  readonly email: string;

  @IsString()
  @ApiProperty({ description: 'The name of a password.' })
  readonly password: string;
}