import { IsString, IsNotEmpty, IsPositive, IsOptional } from 'class-validator';
import { Optional } from '@nestjs/common';

export class PaginationCommentDto {
  @IsPositive()
  @IsNotEmpty()
  page: number;

  @IsString()
  @IsOptional()
  post: string;

  @IsString()
  @IsOptional()
  comment: string;
}

export default PaginationCommentDto;
