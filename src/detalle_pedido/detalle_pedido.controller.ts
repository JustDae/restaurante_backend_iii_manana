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
} from '@nestjs/common';

import { DetallePedidoService } from './detalle_pedido.service';
import { CreateDetallePedidoDto } from './dto/create-detalle_pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle_pedido.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DetallePedido } from './entities/detalle_pedido.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('detalle-pedido')
export class DetallePedidoController {
  constructor(private readonly detallePedidoService: DetallePedidoService) {}

  @Post()
  async create(@Body() dto: CreateDetallePedidoDto) {
    const detallePedido = await this.detallePedidoService.create(dto);

    if (!detallePedido)
      throw new InternalServerErrorException('Failed to create detalle pedido');

    return new SuccessResponseDto(
      'Detalle pedido created successfully',
      detallePedido,
    );
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<DetallePedido>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.detallePedidoService.findAll(query);

    if (!result)
      throw new InternalServerErrorException(
        'Could not retrieve detalle pedidos',
      );

    return new SuccessResponseDto(
      'Detalle pedidos retrieved successfully',
      result,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const detallePedido = await this.detallePedidoService.findOne(+id);

    if (!detallePedido) throw new NotFoundException('Detalle pedido not found');

    return new SuccessResponseDto(
      'Detalle pedido retrieved successfully',
      detallePedido,
    );
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDetallePedidoDto) {
    const detallePedido = await this.detallePedidoService.update(+id, dto);

    if (!detallePedido) throw new NotFoundException('Detalle pedido not found');

    return new SuccessResponseDto(
      'Detalle pedido updated successfully',
      detallePedido,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<SuccessResponseDto<string>> {
    const deleted = await this.detallePedidoService.remove(+id);

    if (!deleted) throw new NotFoundException('Detalle pedido not found');

    return new SuccessResponseDto('Detalle pedido deleted successfully', id);
  }
}
