import { PartialType } from '@nestjs/mapped-types';
import { CreateReseñaDto } from './create-resena.dto';

export class UpdateReseñaDto extends PartialType(CreateReseñaDto) {}
