import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './entities/comment.entity';
import { PostsModule } from '../posts/posts.module';
import { Post, PostSchema } from '../posts/entities/post.entity';
import { Bucket, BucketSchema } from '../bucket/bucket.entity';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
      { name: Bucket.name, schema: BucketSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
