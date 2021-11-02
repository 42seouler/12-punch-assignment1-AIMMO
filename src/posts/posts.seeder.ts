import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsSeeder implements Seeder {
  constructor(@InjectModel(Post.name) private readonly post: Model<Post>) {}

  async seed(): Promise<any> {
    const posts = DataFactory.createForClass(Post).generate(10);

    return this.post.insertMany(posts);
  }

  async drop(): Promise<any> {
    return this.post.deleteMany({});
  }
}
