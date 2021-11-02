import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/user.entity';
import { UsersSeeder } from './users/users.seeder';
import { PostsSeeder } from './posts/posts.seeder';
import { Post, PostSchema } from './posts/entities/post.entity';

seeder({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-course'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
}).run([UsersSeeder, PostsSeeder]);
