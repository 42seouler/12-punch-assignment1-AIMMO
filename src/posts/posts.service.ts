import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.entity';
import { Post } from './entities/post.entity';
import CreatePostDto from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async Search(paginationQueryDto: PaginationQueryDto, req: any) {
    const { limit, offset, search } = paginationQueryDto;
    return this.postModel
      .find({ title: { $regex: req.search } })
      .skip(limit * offset)
      .limit(limit)
      .exec();
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    const { limit, offset } = paginationQueryDto;
    return this.postModel
      .find()
      .skip(limit * offset)
      .limit(limit)
      .exec();
  }

  async findOne(id: string) {
    const post = await this.postModel.findOne({ _id: id }).exec();
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  async findOneAndView(id: string, author: User) {
    const post = await this.postModel.findOne({ _id: id }).exec();
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    if (!post.history.includes(author._id)) {
      post.history.push(author._id);
      post.views += 1;
    }
    let save = post.save();
    return save;
  }


    async create(createPostDto: CreatePostDto, author: User) {
    const category = await this.categoryModel.findOne({ name: createPostDto.category }).exec();
    if (!category) {
      throw new NotFoundException(`Category not found`);
    }
    const createdPost = new this.postModel({
      ...createPostDto,
      views: 0,
      category: category,
      author,
    });
    return createdPost.save();
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const category = await this.categoryModel.findOne({ name: updatePostDto.category }).exec();
    if (!category) {
      throw new NotFoundException(`Category not found`);
    }
    const existingPost = await this.postModel
      .findOneAndUpdate({ _id: id }, { $set: updatePostDto }, { new: true })
      .exec();

    if (!existingPost) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return existingPost;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user.remove();
  }
}
