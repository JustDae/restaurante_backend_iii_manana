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
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Producto } from './entities/producto.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  async create(@Body() dto: CreateProductoDto) {
    const producto = await this.productosService.create(dto);
    if (!producto)
      throw new InternalServerErrorException('Failed to create producto');
    return new SuccessResponseDto('Producto created successfully', producto);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Producto>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.productosService.findAll(query);

    if (!result)
      throw new InternalServerErrorException('Could not retrieve productos');

    return new SuccessResponseDto('Productos retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // ⚠️ CAMBIO AQUÍ: Agregamos el '+' para convertir a número
    const producto = await this.productosService.findOne(+id);

    if (!producto) throw new NotFoundException('Producto not found');
    return new SuccessResponseDto('Producto retrieved successfully', producto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
    // ⚠️ CAMBIO AQUÍ: Agregamos el '+'
    const producto = await this.productosService.update(+id, dto);

    if (!producto) throw new NotFoundException('Producto not found');
    return new SuccessResponseDto('Producto updated successfully', producto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // ⚠️ CAMBIO AQUÍ: Agregamos el '+'
    const producto = await this.productosService.remove(+id);

    if (!producto) throw new NotFoundException('Producto not found');
    return new SuccessResponseDto('Producto deleted successfully', producto);
  }
}
