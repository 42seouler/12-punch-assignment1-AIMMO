import { IsOptional, IsPositive } from 'class-validator';

export class UserPaginationQueryDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  offset: number;
}
