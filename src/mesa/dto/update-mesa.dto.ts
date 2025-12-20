import { IsString, IsInt, Min, IsOptional, IsIn } from 'class-validator';

export class UpdateMesaDto {
  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacidad?: number;

  @IsOptional()
  @IsString()
  @IsIn(['libre', 'ocupada', 'reservada'])
  estado?: string;
}
