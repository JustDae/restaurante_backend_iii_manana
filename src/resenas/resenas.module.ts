import { Module } from '@nestjs/common';
import { ReseñasService } from './resenas.service';
import { ReseñasController } from './resenas.controller';

@Module({
  controllers: [ReseñasController],
  providers: [ReseñasService],
})
export class ReseñasModule {}
