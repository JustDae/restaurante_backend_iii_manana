import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateProductoDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  precio?: number;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}
