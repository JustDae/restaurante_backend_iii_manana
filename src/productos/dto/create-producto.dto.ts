import {
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @Type(() => Number)
  @IsNumber()
  precio: number;

  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string | null;
}