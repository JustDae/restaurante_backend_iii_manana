import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notificacione,
  NotificacioneDocument,
} from './schemas/notificaciones.schema';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectModel(Notificacione.name)
    private notificacionModel: Model<NotificacioneDocument>,
  ) {}

  create(dto: CreateNotificacioneDto) {
    return this.notificacionModel.create(dto);
  }

  findAllByUsuario(usuarioId: string) {
    return this.notificacionModel.find({ usuarioId }).sort({ fecha: -1 });
  }

  marcarComoLeido(id: string) {
    return this.notificacionModel.findByIdAndUpdate(
      id,
      { leido: true },
      { new: true },
    );
  }

  eliminar(id: string) {
    return this.notificacionModel.findByIdAndDelete(id);
  }
}
