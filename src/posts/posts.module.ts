import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { Bucket, BucketSchema } from '../bucket/bucket.entity';
import { Category, CategorySchema } from '../categories/entities/category.entity';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Bucket.name, schema: BucketSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
