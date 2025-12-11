import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('detalle_pedido')
export class pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  nombre_cliente: string;

  @Column()
  nombre_producto: string;

  @Column()
  direccion: string;

  @Column()
  cantidad: number;

  @Column()
  fecha_pedido: Date;

  @Column()
  telefono: string;

  @Column()
  correo: string;

  @Column()
  estado: string;
}
