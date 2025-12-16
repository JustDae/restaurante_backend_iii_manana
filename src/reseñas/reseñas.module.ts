import { Module } from '@nestjs/common';
import { ReseñasService } from './reseñas.service';
import { ReseñasController } from './reseñas.controller';

@Module({
  controllers: [ReseñasController],
  providers: [ReseñasService],
})
export class ReseñasModule {}
