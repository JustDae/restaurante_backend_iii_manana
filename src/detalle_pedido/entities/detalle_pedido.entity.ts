import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Entity('detalle_pedido')
export class DetallePedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  precio_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ nullable: true })
  observaciones: string;

  @ManyToOne(() => Pedido, (pedido) => pedido.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedidoId' })
  pedido: Pedido;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'productoId' })
  producto: Producto;
}
