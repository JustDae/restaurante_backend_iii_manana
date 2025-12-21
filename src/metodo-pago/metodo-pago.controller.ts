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
import { MetodoPagoService } from './metodo-pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('metodo-pago')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MetodoPagoController {
  constructor(private readonly metodoService: MetodoPagoService) {}

  @Post()
  async create(@Body() dto: CreateMetodoPagoDto) {
    const data = await this.metodoService.create(dto);
    return new SuccessResponseDto('Método de pago creado', data);
  }

  @Get()
  async findAll() {
    const data = await this.metodoService.findAll();
    return new SuccessResponseDto('Lista de métodos de pago', data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.metodoService.findOne(id);
    return new SuccessResponseDto('Detalle del método', data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMetodoPagoDto,
  ) {
    const data = await this.metodoService.update(id, dto);
    return new SuccessResponseDto('Método actualizado', data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.metodoService.remove(id);
    return new SuccessResponseDto('Método eliminado', data);
  }
}
