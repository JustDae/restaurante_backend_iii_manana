import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Cambiado de TypeORM a Mongoose
import { ResenasService } from './resenas.service';
import { ResenasController } from './resenas.controller';
import { Resena, ResenaSchema } from './schemas/resenas.schema';

@Module({
  imports: [
    // Usamos MongooseModule en lugar de TypeOrmModule
    MongooseModule.forFeature([
      { name: Resena.name, schema: ResenaSchema },
    ]),
  ],
  controllers: [ResenasController],
  providers: [ResenasService],
})
export class ResenasModule {}