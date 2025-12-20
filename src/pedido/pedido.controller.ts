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
} from '@nestjs/common';

import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Pedido } from './entities/pedido.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  @UseInterceptors(AuditInterceptor)
  async create(@Body() dto: CreatePedidoDto) {
    const pedido = await this.pedidoService.create(dto);
    if (!pedido)
      throw new InternalServerErrorException('Failed to create pedido');
    return new SuccessResponseDto('Pedido created successfully', pedido);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Pedido>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.pedidoService.findAll(query);
    if (!result)
      throw new InternalServerErrorException('Could not retrieve pedidos');

    return new SuccessResponseDto('Pedidos retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pedido = await this.pedidoService.findOne(id);
    if (!pedido) throw new NotFoundException('Pedido not found');
    return new SuccessResponseDto('Pedido retrieved successfully', pedido);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePedidoDto) {
    const pedido = await this.pedidoService.update(id, dto);
    if (!pedido) throw new NotFoundException('Pedido not found');
    return new SuccessResponseDto('Pedido updated successfully', pedido);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const pedido = await this.pedidoService.remove(id);
    if (!pedido) throw new NotFoundException('Pedido not found');
    return new SuccessResponseDto('Pedido deleted successfully', pedido);
  }
}
