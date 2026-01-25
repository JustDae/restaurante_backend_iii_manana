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
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Producto } from './entities/producto.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { QueryDto } from '../common/dto/query.dto';
import { extname } from 'path';

const multerConfig = {
  storage: diskStorage({
    destination: './public/productos',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return cb(new BadRequestException('Solo se permiten archivos JPG o PNG'), false);
    }
    cb(null, true);
  },
};

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(
    @Body() dto: CreateProductoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const filename = file ? file.filename : undefined;
    const producto = await this.productosService.create({ ...dto, imageUrl: filename });
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
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(
    @Param('id') id: string, 
    @Body() dto: UpdateProductoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateData = { ...dto } as any;
    if (file) updateData['imageUrl'] = file.filename;

    const producto = await this.productosService.update(+id, updateData);
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
  @UseInterceptors(FileInterceptor('imagen', multerConfig))
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