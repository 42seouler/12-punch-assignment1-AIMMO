import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.entity';
import { Category } from './entities/category.entity';
import CreateCategoryDto from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  findAll(paginationQueryDto: PaginationQueryDto) {
    const { limit, offset } = paginationQueryDto;
    return this.categoryModel
      .find()
      .skip(limit * offset)
      .limit(limit)
      .exec();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  create(createCategoryDto: CreateCategoryDto, author: User) {
    const createdCategory = new this.categoryModel({
      ...createCategoryDto,
      author,
    });
    return createdCategory.save();
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto)
      .setOptions({ overwrite: true, new: true });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async remove(categoryId: string) {
    const result = await this.categoryModel.findByIdAndDelete(categoryId);
    if (!result) {
      throw new NotFoundException(`Category #${categoryId} not found`);
    }
  }
}

export default CategoriesService;
