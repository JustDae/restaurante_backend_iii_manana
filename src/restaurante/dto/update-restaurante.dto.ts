import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateRestauranteDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  @Length(10, 13)
  ruc?: string;

  @IsOptional()
  @IsString()
  slogan?: string;
}
