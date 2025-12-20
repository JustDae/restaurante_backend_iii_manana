import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('metodo_pago')
export class MetodoPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;
}
