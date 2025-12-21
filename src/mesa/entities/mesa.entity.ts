import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mesa')
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: string;

  @Column()
  capacidad: number;

  @Column({ default: 'libre' })
  estado: string;
}
