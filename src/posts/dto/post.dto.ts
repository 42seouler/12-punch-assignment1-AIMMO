import { IsString } from 'class-validator'
export class PostDto {
    @IsString()
    post: string;
}