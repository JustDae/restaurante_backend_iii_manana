import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('notificaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
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
