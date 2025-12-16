import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  precio: number;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}
