import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';

@Controller('resenas')
export class ResenasController {
  constructor(private readonly service: ResenasService) {}

  @Post()
  create(@Body() dto: CreateResenaDto) {
    return this.service.create(dto);
  }

  @Get('restaurante/:id')
  findByRestaurante(@Param('id') id: string) {
    return this.service.findAllByRestaurante(id);
  }

  @Get('usuario/:id')
  findByUsuario(@Param('id') id: string) {
    return this.service.findAllByUsuario(id);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.service.eliminar(id);
  }
}
