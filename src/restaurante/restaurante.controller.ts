import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('restaurante')
export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateRestauranteDto) {
    const data = await this.restauranteService.create(dto);
    return new SuccessResponseDto('Restaurante configurado exitosamente', data);
  }

  @Get()
  async findAll() {
    const data = await this.restauranteService.findAll();
    return new SuccessResponseDto('Información del restaurante obtenida', data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.restauranteService.findOne(id);
    return new SuccessResponseDto('Detalle del restaurante', data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRestauranteDto,
  ) {
    const data = await this.restauranteService.update(id, dto);
    return new SuccessResponseDto(
      'Información actualizada correctamente',
      data,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.restauranteService.remove(id);
    return new SuccessResponseDto('Restaurante eliminado correctamente', null);
  }

  @Put(':id/logo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './public/restaurante',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `logo-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Solo se permiten imágenes JPG o PNG'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadLogo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('La imagen es obligatoria');

    const data = await this.restauranteService.updateLogo(id, file.filename);

    return new SuccessResponseDto('Logo actualizado correctamente', data);
  }
}
