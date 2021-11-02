import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import CategoriesService from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import CreateCategoryDto from './dto/create-category.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get()
  async getAllCategories(@Query() paginationQuery: PaginationQueryDto) {
    return this.categoriesService.findAll(paginationQuery);
  }

  @Get(':id')
  async getCategory(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCategory(@Body() category: CreateCategoryDto, @Req() req) {
    return this.categoriesService.create(category, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
