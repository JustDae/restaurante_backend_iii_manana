import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateFacturaDto {
  @IsOptional()
  @IsString()
  razonSocial?: string;

  @IsOptional()
  @IsString()
  ruc_cedula?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  total?: number;
}