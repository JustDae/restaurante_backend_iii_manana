import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column()
  estado: string;

  @Column()
  fecha_pedido: Date;

  @Column()
  total: number;
}
