import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { UsersEntity } from './users/users.entity';
import { PostsEntity } from './posts/posts.entity';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite', 
      entities: [UsersEntity, PostsEntity],
      synchronize: true
    }), 
    UsersModule, 
    PostsModule, CommentsModule
  ],
  controllers: [AppController, CommentsController],
  providers: [AppService, CommentsService],
})
export class AppModule {}
