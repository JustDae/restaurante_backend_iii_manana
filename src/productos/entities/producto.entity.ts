import { Category } from '../../categories/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column('decimal')
  precio: number;

  @Column({type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ type: 'boolean', default: true, nullable: true })
  estado: boolean;

  @ManyToOne(() => Category, (category) => category.productos, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: Category;
}