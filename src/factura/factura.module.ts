import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { Factura } from './entities/factura.entity';
import { Pedido } from '../pedido/entities/pedido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, Pedido])],
  controllers: [FacturaController],
  providers: [FacturaService],
})
export class FacturaModule {}
