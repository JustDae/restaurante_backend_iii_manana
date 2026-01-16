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
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Pedido } from './entities/pedido.entity';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { QueryDto } from '../common/dto/query.dto';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pedidos')
@UseGuards(JwtAuthGuard)
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  @UseInterceptors(AuditInterceptor)
  async create(@Body() dto: CreatePedidoDto) {
    const pedido = await this.pedidoService.create(dto);
    if (!pedido)
      throw new InternalServerErrorException('No se pudo crear el pedido');

    return new SuccessResponseDto('Pedido creado exitosamente', pedido);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Pedido>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.pedidoService.findAll(query);
    if (!result)
      throw new InternalServerErrorException(
        'No se pudieron obtener los pedidos',
      );

    return new SuccessResponseDto('Pedidos obtenidos exitosamente', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pedido = await this.pedidoService.findOne(id);
    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    return new SuccessResponseDto('Pedido obtenido exitosamente', pedido);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePedidoDto) {
    const pedido = await this.pedidoService.update(id, dto);
    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    return new SuccessResponseDto('Pedido actualizado exitosamente', pedido);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const pedido = await this.pedidoService.remove(id);
    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    return new SuccessResponseDto('Pedido eliminado exitosamente', pedido);
  }
}
