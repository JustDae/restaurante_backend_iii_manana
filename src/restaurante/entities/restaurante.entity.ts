import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('restaurantes')
export class Restaurante {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
