import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateMesaDto {
  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsInt()
  @Min(1)
  capacidad: number;

  @IsOptional()
  @IsString()
  @IsIn(['libre', 'ocupada', 'reservada'])
  estado?: string;
}
