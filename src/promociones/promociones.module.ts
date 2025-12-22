import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromocionesService } from './promociones.service';
import { PromocionesController } from './promociones.controller';
import { Promocion, PromocionSchema } from './schemas/promocion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Promocion.name, schema: PromocionSchema },
    ]),
  ],
  controllers: [PromocionesController],
  providers: [PromocionesService],
})
export class PromocionesModule {}
