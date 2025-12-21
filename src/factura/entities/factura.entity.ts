import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Pedido } from '../../pedido/entities/pedido.entity';

@Entity('factura')
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaEmision: Date;

  @Column()
  razonSocial: string;

  @Column()
  ruc_cedula: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @OneToOne(() => Pedido)
  @JoinColumn({ name: 'pedidoId' })
  pedido: Pedido;
}
