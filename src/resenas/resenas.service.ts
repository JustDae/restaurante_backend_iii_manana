import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/typeorm';
import { Model } from 'typeorm';
import { Resena, ResenaDocument } from './schemas/resenas.schema';
import { CreateResenaDto } from './dto/create-resena.dto';

@Injectable()
export class ResenasService {
  constructor(
    @InjectModel(Resena.name)
    private resenaModel: Model<ResenaDocument>,
  ) {}

  crear(dto: CreateResenaDto) {
    return this.resenaModel.create(dto);
  }

  listar() {
    return this.resenaModel.find().sort({ fecha: -1 });
  }
}
