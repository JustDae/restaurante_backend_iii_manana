import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDto } from './create-detalle_pedido.dto';

export class UpdateDetallePedidoDto extends PartialType(CreatePedidoDto) {}
