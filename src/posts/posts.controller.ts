import { Body, Controller, Post, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import CreatePostDto from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    console.log(req.user);
    return this.postsService.create(createPostDto, req.user);
  }
}
