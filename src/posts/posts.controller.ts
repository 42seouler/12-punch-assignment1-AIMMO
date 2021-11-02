import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { isAuthorGuard } from 'src/guards/is-author.guard';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { CurrentUserInterceptor } from 'src/users/interceptor/current-user.interceptor';
import { UsersEntity } from 'src/users/users.entity';
import { PostDto } from './dto/post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
export class PostsController {

    constructor(
        private postsService: PostsService
    ) {}

    @Post()
    createPost(@Body() body: PostDto, @CurrentUser() user: UsersEntity) {
        return this.postsService.createPost(body, user);
    }

    @Get('/:id')
    async findPost(@Param('id') id: string) {
        const post = await this.postsService.findOne(Number(id))
        if (!post) throw new NotFoundException('Post not found')
        return post;
    }

    @Get()
    findAllPosts(@Query() query) {
        const offset = query.offset;
        const limit = query.limit;
        return this.postsService.findAll(offset, limit);
    }

    @Patch('/:id')
    @UseGuards(isAuthorGuard)
    updatePost(@Param('id') id: string, @Body() body: PostDto) {
        return this.postsService.updatePost(Number(id), body);
    }

    @Delete('/:id')
    @UseGuards(isAuthorGuard)
    deletePost(@Param('id') id: string) {
        return this.postsService.deletePost(Number(id));
    }

}
