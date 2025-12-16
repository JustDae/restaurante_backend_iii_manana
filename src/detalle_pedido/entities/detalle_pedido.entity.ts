import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('detalle_pedido')
export class DetallePedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  nombre_cliente: string;

  @Column({ nullable: true })
  nombre_producto: string;

  @Column()
  direccion: string;

  @Column()
  cantidad: number;

  @Column()
  fecha_pedido: Date;

  @Column()
  telefono: string;

  @Column({ unique: true })
  correo: string;

  @Column({ nullable: true })
  estado: string;
}
