import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resena, ResenaDocument } from './schemas/resenas.schema';
import { CreateResenaDto } from './dto/create-resena.dto';

@Injectable()
export class ResenasService {
  constructor(
    @InjectModel(Resena.name)
    private resenaModel: Model<ResenaDocument>,
  ) {}

  async create(dto: CreateResenaDto) {
    return this.resenaModel.create(dto);
  }

  async findAllByRestaurante(id: string) {
    return this.resenaModel.find({ restauranteId: id }).exec();
  }

  async findAllByUsuario(id: string) {
    return this.resenaModel.find({ usuarioId: id }).exec();
  }

  async eliminar(id: string) {
    return this.resenaModel.findByIdAndDelete(id).exec();
  }

  async listar() {
    return this.resenaModel.find().sort({ fecha: -1 }).exec();
  }
}
