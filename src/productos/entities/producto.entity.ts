import { Category } from 'src/categories/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column('decimal')
  precio: number;

  @Column({ nullable: true })
  estado: boolean;

  @ManyToOne(() => Category, (category) => category.productos, { eager: true })
  category: Category;
}
