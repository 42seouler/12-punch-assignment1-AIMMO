import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  post: string;

  @IsString()
  @IsOptional()
  parent: string;
}

export default CreateCommentDto;
