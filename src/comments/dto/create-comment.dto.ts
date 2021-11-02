import { IsString, IsNotEmpty } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @Optional()
  @IsNotEmpty()
  post: string;
}

export default CreateCommentDto;
