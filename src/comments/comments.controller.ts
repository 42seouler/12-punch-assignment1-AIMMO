import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import CreateCommentDto from './dto/create-comment.dto';
import PaginationCommentDto from './dto/pagination-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll(@Body() paginationCommentDto: PaginationCommentDto) {
    return this.commentsService.findAllComment(paginationCommentDto);
  }

  @Get('nested')
  findAllNested(@Body() paginationCommentDto: PaginationCommentDto) {
    return this.commentsService.findAllNestedComment(paginationCommentDto);
  }

  @Get(':id')
  async getComment(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(createCommentDto, req.user);
  }

  @Post('nested')
  @UseGuards(JwtAuthGuard)
  async createNestedComment(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.createNested(createCommentDto, req.user);
  }
}
