import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateRestauranteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 13)
  ruc: string;

  @IsOptional()
  @IsString()
  slogan?: string;
}
