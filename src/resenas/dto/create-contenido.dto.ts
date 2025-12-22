import { IsInt, Min, Max, IsString } from 'class-validator';

export class CreateContenidoDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comentario: string;
}
