import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Rol } from './entities/rol.entity';

@Controller('rol')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  async create(@Body() dto: CreateRolDto) {
    const rol = await this.rolService.create(dto);
    if (!rol) throw new InternalServerErrorException('No se pudo crear el rol');

    return new SuccessResponseDto('Rol creado exitosamente', rol);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Rol>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.rolService.findAll(query);
    if (!result)
      throw new InternalServerErrorException(
        'No se pudieron obtener los roles',
      );

    return new SuccessResponseDto('Roles obtenidos exitosamente', result);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const rol = await this.rolService.findOne(id);
    if (!rol) throw new NotFoundException('Rol no encontrado');

    return new SuccessResponseDto('Rol obtenido exitosamente', rol);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRolDto,
  ) {
    const rol = await this.rolService.update(id, dto);
    if (!rol) throw new NotFoundException('Rol no encontrado');

    return new SuccessResponseDto('Rol actualizado exitosamente', rol);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const rol = await this.rolService.remove(id);
    if (!rol) throw new NotFoundException('Rol no encontrado');

    return new SuccessResponseDto('Rol eliminado exitosamente', rol);
  }
}
