import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Mesa } from 'src/mesa/entities/mesa.entity';
import { MetodoPago } from 'src/metodo-pago/entities/metodo-pago.entity';
import { DetallePedido } from 'src/detalle_pedido/entities/detalle_pedido.entity';
import { User } from 'src/users/user.entity';

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre_cliente: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column({ unique: true })
  correo: string;

  @Column({ default: 'pendiente' })
  estado: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_pedido: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @ManyToOne(() => Mesa)
  @JoinColumn({ name: 'mesaId' })
  mesa: Mesa;

  @ManyToOne(() => MetodoPago)
  @JoinColumn({ name: 'metodoPagoId' })
  metodoPago: MetodoPago;

  @OneToMany(() => DetallePedido, (detalle) => detalle.pedido, {
    cascade: true,
  })
  detalles: DetallePedido[];

  @ManyToOne(() => User, (user) => user.pedidos)
  usuario: User;
}
