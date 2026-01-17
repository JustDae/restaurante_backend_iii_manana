import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import {
  Notificacione,
  NotificacioneSchema,
} from './schemas/notificaciones.schema';
import { NotificacionesGateway } from './notificaciones.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notificacione.name, schema: NotificacioneSchema },
    ]),
  ],
  controllers: [NotificacionesController],
  providers: [NotificacionesService, NotificacionesGateway],
  exports: [NotificacionesService]
})
export class NotificacionesModule {}
