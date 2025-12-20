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
} from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

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
}
