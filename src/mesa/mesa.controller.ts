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
import { MesaService } from './mesa.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('mesa')
@UseGuards(JwtAuthGuard)
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Post()
  async create(@Body() dto: CreateMesaDto) {
    const data = await this.mesaService.create(dto);
    return new SuccessResponseDto('Mesa creada correctamente', data);
  }

  @Get()
  async findAll() {
    const data = await this.mesaService.findAll();
    return new SuccessResponseDto('Listado de mesas', data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.mesaService.findOne(id);
    return new SuccessResponseDto('Detalle de mesa', data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMesaDto,
  ) {
    const data = await this.mesaService.update(id, dto);
    return new SuccessResponseDto('Mesa actualizada', data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.mesaService.remove(id);
    return new SuccessResponseDto('Mesa eliminada', data);
  }
}
