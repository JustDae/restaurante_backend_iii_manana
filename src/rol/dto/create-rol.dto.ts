import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo: boolean;
}
