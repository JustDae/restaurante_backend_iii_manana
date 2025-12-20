import { 
  Controller, Get, Post, Body, Put, Param, UseGuards, ParseIntPipe 
} from '@nestjs/common';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('factura')
@UseGuards(JwtAuthGuard)
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Post()
  async create(@Body() dto: CreateFacturaDto) {
    const data = await this.facturaService.create(dto);
    return new SuccessResponseDto('Factura generada exitosamente', data);
  }

  @Get()
  async findAll() {
    const data = await this.facturaService.findAll();
    return new SuccessResponseDto('Historial de facturas', data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.facturaService.findOne(id);
    return new SuccessResponseDto('Detalle de factura', data);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFacturaDto) {
    const data = await this.facturaService.update(id, dto);
    return new SuccessResponseDto('Factura corregida', data);
  }
}