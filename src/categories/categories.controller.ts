import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Category } from './category.entity';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { QueryDto } from '../common/dto/query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    const category = await this.categoriesService.create(dto);
    if (!category)
      throw new InternalServerErrorException('Failed to create category');
    return new SuccessResponseDto('Category created successfully', category);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Category>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.categoriesService.findAll({
      page: query.page || 1,
      limit: query.limit || 10,
      search: query.search,
      searchField: query.searchField || 'name',
      sortBy: query.sort || 'id',
      sortOrder: (query.order as 'ASC' | 'DESC') || 'ASC',
      route: 'http://localhost:3000/categories',
    });

    if (!result)
      throw new InternalServerErrorException('Could not retrieve categories');

    return new SuccessResponseDto('Categories retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    return new SuccessResponseDto('Category retrieved successfully', category);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const category = await this.categoriesService.update(id, dto);
    if (!category) throw new NotFoundException('Category not found');
    return new SuccessResponseDto('Category updated successfully', category);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const category = await this.categoriesService.remove(id);
    if (!category) throw new NotFoundException('Category not found');
    return new SuccessResponseDto('Category deleted successfully', category);
  }
}
