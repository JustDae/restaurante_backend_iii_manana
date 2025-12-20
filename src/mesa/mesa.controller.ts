import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { MesaService } from './mesa.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('mesas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Post()
  async create(@Body() dto: CreateMesaDto) {
    const mesa = await this.mesaService.create(dto);
    if (!mesa) throw new InternalServerErrorException('Error al crear la mesa');
    return new SuccessResponseDto('Mesa creada exitosamente', mesa);
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    const result = await this.mesaService.findAll({
      page: query.page || 1,
      limit: query.limit || 10,
      search: query.search,
      searchField: query.searchField || 'numero',
      sortBy: query.sort || 'id',
      sortOrder: query.order || 'ASC',
      route: 'http://localhost:3000/mesas',
    });

    if (!result)
      throw new InternalServerErrorException(
        'No se pudieron obtener las mesas',
      );

    return new SuccessResponseDto('Mesas obtenidas exitosamente', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const mesa = await this.mesaService.findOne(+id);
    if (!mesa) throw new NotFoundException('Mesa no encontrada');
    return new SuccessResponseDto('Mesa obtenida exitosamente', mesa);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMesaDto) {
    const mesa = await this.mesaService.update(+id, dto);
    if (!mesa)
      throw new NotFoundException('Mesa no encontrada o error al actualizar');
    return new SuccessResponseDto('Mesa actualizada exitosamente', mesa);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const mesa = await this.mesaService.remove(+id);
    if (!mesa)
      throw new NotFoundException('Mesa no encontrada o error al eliminar');
    return new SuccessResponseDto('Mesa eliminada exitosamente', mesa);
  }
}
