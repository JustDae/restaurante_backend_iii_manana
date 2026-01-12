import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  ParseIntPipe,
  Query,
  InternalServerErrorException,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Factura } from './entities/factura.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('factura')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Post()
  async create(@Body() dto: CreateFacturaDto) {
    const data = await this.facturaService.create(dto);

    if (!data)
      throw new InternalServerErrorException('Failed to create factura');

    return new SuccessResponseDto('Factura generada exitosamente', data);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Factura>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.facturaService.findAll(query);

    if (!result)
      throw new InternalServerErrorException('Could not retrieve facturas');

    return new SuccessResponseDto('Historial de facturas', result);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.facturaService.findOne(id);

    if (!data) throw new NotFoundException('Factura not found');

    return new SuccessResponseDto('Detalle de factura', data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFacturaDto,
  ) {
    const data = await this.facturaService.update(id, dto);

    if (!data) throw new NotFoundException('Factura not found');

    return new SuccessResponseDto('Factura corregida', data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.facturaService.remove(id);

    if (!data) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    return new SuccessResponseDto('Factura eliminada del registro', data);
  }
}
