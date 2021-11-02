import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserInterceptor } from 'src/users/interceptor/current-user.interceptor';
import { UsersEntity } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { PostsController } from './posts.controller';
import { PostsEntity } from './posts.entity';
import { PostsService } from './posts.service';

@Module({
    imports: [TypeOrmModule.forFeature([PostsEntity, UsersEntity])],
    controllers: [PostsController],
    providers: [PostsService, UsersService, CurrentUserInterceptor]
})
export class PostsModule {}
