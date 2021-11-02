import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import CreateCommentDto from './dto/create-comment.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll(@Body() req: any) {
    return this.commentsService.findAll(req);
  }

  @Get(':id')
  async getComment(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(@Body() createPostDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(createPostDto, req.user);
  }
}
