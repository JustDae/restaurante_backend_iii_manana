import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('restaurantes')
export class Restaurante {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column({ unique: true })
  ruc: string;

  @Column({ nullable: true })
  slogan: string;
}
