import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { isAuthorGuard } from 'src/guards/is-author.guard';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { CurrentUserInterceptor } from 'src/users/interceptor/current-user.interceptor';
import { UsersEntity } from 'src/users/users.entity';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';

@Controller('comments')
@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
export class CommentsController {

    constructor(
        private commentsService: CommentsService
    ) {}

    @Post()
    createComment(@Body() body: CommentDto, @CurrentUser() user: UsersEntity) {
        return this.commentsService.createComment(body, user);
    }

    @Get('/:id')
    async findComment(@Param('id') id: string) {
        const comment = await this.commentsService.findOne(Number(id))
        if (!comment) throw new NotFoundException('comment not found')
        return comment;
    }

    @Get()
    findAllComments(@Query() query) {
        const offset = query.offset;
        const limit = query.limit;
        return this.commentsService.findAll(offset, limit);
    }

    @Patch('/:id')
    @UseGuards(isAuthorGuard)
    updateComment(@Param('id') id: string, @Body() body: CommentDto) {
        return this.commentsService.updateComment(Number(id), body);
    }

    @Delete('/:id')
    @UseGuards(isAuthorGuard)
    deleteComment(@Param('id') id: string) {
        return this.commentsService.deleteComment(Number(id));
    }

}
