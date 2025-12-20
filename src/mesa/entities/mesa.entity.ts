import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mesa')
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // El número/nombre no debe repetirse
  numero: string; // Ej: "Mesa 1", "Barra A", "Terraza 2"

  @Column()
  capacidad: number; // Ej: 4 personas

  @Column({ default: 'libre' })
  estado: string;
}
