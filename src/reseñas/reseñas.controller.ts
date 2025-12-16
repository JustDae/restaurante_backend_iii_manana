import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReseñasService } from './reseñas.service';
import { CreateReseñaDto } from './dto/create-reseña.dto';
import { UpdateReseñaDto } from './dto/create-contenido.dto';

@Controller('reseñas')
export class ReseñasController {
  constructor(private readonly reseñasService: ReseñasService) {}

  @Post()
  create(@Body() createReseñaDto: CreateReseñaDto) {
    return this.reseñasService.create(createReseñaDto);
  }

  @Get()
  findAll() {
    return this.reseñasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reseñasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReseñaDto: UpdateReseñaDto) {
    return this.reseñasService.update(+id, updateReseñaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reseñasService.remove(+id);
  }
}
