import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenasService } from './resenas.service';
import { ResenasController } from './resenas.controller';
import { Resena, ResenaSchema } from './schemas/resenas.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      { name: Resena.name, schema: ResenaSchema },
    ]),
  ],
  controllers: [ResenasController],
  providers: [ResenasService],
})
export class ResenasModule {}
