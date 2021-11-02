import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.entity';
import { Post } from './entities/post.entity';
import CreatePostDto from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  create(postData: CreatePostDto, author: User) {
    const createdPost = new this.postModel({
      ...postData,
      author,
    });
    return createdPost.save();
  }
}
