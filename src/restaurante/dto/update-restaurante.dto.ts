import { IsOptional, IsString } from 'class-validator';

export class UpdateRestauranteDto {
  @IsString()
  @IsOptional()
  name?: string;
}
