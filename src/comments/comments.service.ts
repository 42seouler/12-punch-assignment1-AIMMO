import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './entities/comment.entity';
import { User } from '../users/user.entity';
import CreateCommentDto from './dto/create-comment.dto';
import { Post } from '../posts/entities/post.entity';
import { Bucket } from '../bucket/bucket.entity';
import { UpdateUserDto } from '../users/dto/update-user-dto';
import PaginationCommentDto from './dto/pagination-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Bucket.name) private bucketModel: Model<Bucket>,
  ) {}

  async findAllNestedComment(paginationCommentDto: PaginationCommentDto) {
    const existingComment = await this.commentModel.findById(
      paginationCommentDto.comment,
    );
    if (!existingComment) {
      throw new NotFoundException(
        `Comment #${paginationCommentDto.comment} not found`,
      );
    }
    let bucket = [];
    if (existingComment.bucket.length !== 0 && paginationCommentDto.page <= existingComment.bucket.length) {
      const bucketId = existingComment.bucket[paginationCommentDto.page - 1];
      bucket = await this.bucketModel.findById(bucketId).populate('comment');
    }
    return {
      totalPage: existingComment.bucket.length,
      currentPage: paginationCommentDto.page,
      comments: bucket,
    };
  }

  async findAllComment(paginationCommentDto: PaginationCommentDto) {
    const existingPost = await this.postModel.findById(
      paginationCommentDto.post,
    );
    if (!existingPost) {
      throw new NotFoundException(
        `Post #${paginationCommentDto.post} not found`,
      );
    }
    let bucket = [];
    if (existingPost.bucket.length !== 0 && paginationCommentDto.page <= existingPost.bucket.length) {
      const bucketId = existingPost.bucket[paginationCommentDto.page - 1];
      bucket = await this.bucketModel.findById(bucketId).populate('comment');
    }
    return {
      totalPage: existingPost.bucket.length,
      currentPage: paginationCommentDto.page,
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
      depth: 1,
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

  async createNested(createCommentDto: CreateCommentDto, author: User) {
    const existingComment = await this.commentModel.findById(
      createCommentDto.parent,
    );
    if (!existingComment) {
      throw new NotFoundException(
        `Comment #${createCommentDto.parent} not found`,
      );
    }
    if (existingComment.depth >= 2) {
      throw new BadRequestException('대댓글에 댓글은 작성 할 수 없습니다');
    }
    const createdComment = new this.commentModel({
      ...createCommentDto,
      post: existingComment.post,
      depth: 2,
      author,
    });
    const comment = await createdComment.save();
    if (existingComment.bucket.length === 0) {
      const newBucket = {
        count: 1,
        comment: [comment],
      };
      const saveBucket = await new this.bucketModel({
        ...newBucket,
      }).save();
      existingComment.bucket.push(saveBucket);
      existingComment.save();
    } else {
      const bucketId = existingComment.bucket[existingComment.bucket.length - 1];
      const existingBucket = await this.bucketModel.findById(bucketId);
      if (existingBucket.count === 100) {
        const newBucket = {
          count: 1,
          comment: [comment],
        };
        const saveBucket = await new this.bucketModel({
          ...newBucket,
        }).save();
        existingComment.bucket.push(saveBucket);
        existingComment.save();
      } else {
        existingBucket.count += 1;
        existingBucket.comment.push(comment);
        existingBucket.save();
      }
    }
    return comment;
  }
}
