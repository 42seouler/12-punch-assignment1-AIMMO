import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './entities/comment.entity';
import { User } from '../users/user.entity';
import CreateCommentDto from './dto/create-comment.dto';
import { Post } from '../posts/entities/post.entity';
import { Bucket } from '../bucket/bucket.entity';
import { UpdateUserDto } from '../users/dto/update-user-dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Bucket.name) private bucketModel: Model<Bucket>,
  ) {
  }

  async findAll(req: any) {
    const existingPost = await this.postModel.findById(req.post);
    if (!existingPost) {
      throw new NotFoundException(`Post #${req.post} not found`);
    }
    let bucket = [];
    if (existingPost.bucket.length !== 0 && req.page <= existingPost.bucket.length) {
      const bucketId = existingPost.bucket[req.page - 1];
      bucket = await this.bucketModel.findById(bucketId).populate('comment');
    }
    return {
      totalPage: existingPost.bucket.length,
      currentPage: req.page,
      comments: bucket,
    };
  }

  async findOne(id: string) {
    const comments = await this.commentModel.findById(id);
    if (!comments) {
      throw new NotFoundException(`Comment #${id} not found`);
    }
    return comments;
  }

  async create(createCommentDto: CreateCommentDto, author: User) {
    const existingPost = await this.postModel.findById(createCommentDto.post);
    if (!existingPost) {
      throw new NotFoundException(`Post #${createCommentDto.post} not found`);
    }
    const createdComment = new this.commentModel({
      ...createCommentDto,
      author,
    });
    const comment = await createdComment.save();
    if (existingPost.bucket.length === 0) {
      const newBucket = {
        count: 1,
        comment: [comment],
      };
      const saveBucket = await new this.bucketModel({
        ...newBucket,
      }).save();
      existingPost.bucket.push(saveBucket);
      existingPost.save();
    } else {
      const bucketId = existingPost.bucket[existingPost.bucket.length - 1];
      const existingBucket = await this.bucketModel.findById(bucketId);
      if (existingBucket.count === 100) {
        const newBucket = {
          count: 1,
          comment: [comment],
        };
        const saveBucket = await new this.bucketModel({
          ...newBucket,
        }).save();
        existingPost.bucket.push(saveBucket);
        existingPost.save();
      } else {
        existingBucket.count += 1;
        existingBucket.comment.push(comment);
        existingBucket.save();
      }
    }
    return comment;
  }
}