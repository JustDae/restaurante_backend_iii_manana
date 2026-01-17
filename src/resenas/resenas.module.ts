import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResenasService } from './resenas.service';
import { ResenasController } from './resenas.controller';
import { Resena, ResenaSchema } from './schemas/resenas.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resena.name, schema: ResenaSchema }]),
  ],
  controllers: [ResenasController],
  providers: [ResenasService],
})
export class ResenasModule {}
