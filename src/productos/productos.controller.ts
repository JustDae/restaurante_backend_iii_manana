import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Producto } from './entities/producto.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { QueryDto } from 'src/common/dto/query.dto';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  async create(@Body() dto: CreateProductoDto) {
    const producto = await this.productosService.create(dto);
    return new SuccessResponseDto('Producto created successfully', producto);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
    @Query('estado') estado?: string,
  ): Promise<SuccessResponseDto<Pagination<Producto>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    if (estado !== undefined && estado !== 'true' && estado !== 'false') {
      throw new BadRequestException(
        'El valor de "estado" debe ser "true" o "false".',
      );
    }

    const result = await this.productosService.findAll(
      query,
      estado === undefined ? undefined : estado === 'true',
    );

    if (!result)
      throw new InternalServerErrorException(
        'No se pudieron obtener los productos',
      );

    return new SuccessResponseDto('Productos obtenidos exitosamente', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const producto = await this.productosService.findOne(+id);

    if (!producto) throw new NotFoundException('Producto no encontrado');
    return new SuccessResponseDto('Producto obtenido exitosamente', producto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
    const producto = await this.productosService.update(+id, dto);
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return new SuccessResponseDto(
      'Producto actualizado exitosamente',
      producto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const producto = await this.productosService.remove(+id);
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return new SuccessResponseDto('Producto eliminado exitosamente', producto);
  }

  @Put(':id/imagen')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './public/productos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Solo se permiten archivos JPG o PNG'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException('Se requiere un archivo de imagen');

    const producto = await this.productosService.updateImage(
      +id,
      file.filename,
    );

    if (!producto) throw new NotFoundException('Producto not found');
    return new SuccessResponseDto('Imagen de producto actualizada', producto);
  }
}
