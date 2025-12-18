import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rol } from '../rol/entities/rol.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  profile: string;

  @ManyToOne(() => Rol, (rol) => rol.users, { eager: true })
  @JoinColumn({ name: 'rol_id' }) // Esto crea la columna 'rol_id' en tu base de datos postgres
  rol: Rol;
}
