import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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
