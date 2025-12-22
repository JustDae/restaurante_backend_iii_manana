import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('resenas')
@UseGuards(JwtAuthGuard, RolesGuard)
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
