import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promocion } from './schemas/promocion.schema';
import { CreatePromocioneDto } from './dto/create-promocione.dto';

@Injectable()
export class PromocionesService {
  constructor(
    @InjectModel(Promocion.name) private promocionModel: Model<Promocion>,
  ) {}

  async create(createPromocionDto: CreatePromocioneDto): Promise<Promocion> {
    const nuevaPromocion = new this.promocionModel(createPromocionDto);
    return nuevaPromocion.save();
  }

  async findAll(): Promise<Promocion[]> {
    return this.promocionModel.find().exec();
  }

  async findOne(id: string): Promise<Promocion | null> {
    return this.promocionModel.findById(id).exec();
  }

  async remove(id: string): Promise<Promocion | null> {
    return this.promocionModel.findByIdAndDelete(id).exec();
  }
}
