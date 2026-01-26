import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductoDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  precio?: number;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;

  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string | null;
}