import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly service: NotificacionesService) {}

  @Post()
  create(@Body() dto: CreateNotificacioneDto) {
    return this.service.create(dto);
  }

  @Get('usuario/:id')
  findByUsuario(@Param('id') id: string) {
    return this.service.findAllByUsuario(id);
  }

  @Patch(':id/leido')
  marcarLeido(@Param('id') id: string) {
    return this.service.marcarComoLeido(id);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.service.eliminar(id);
  }
}
