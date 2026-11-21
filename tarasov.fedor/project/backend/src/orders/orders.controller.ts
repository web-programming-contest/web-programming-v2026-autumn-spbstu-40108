import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { SessionUser } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  type CreatedOrderResult,
  type OrderSummary,
  OrdersService,
} from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@CurrentUser() user: SessionUser): Promise<OrderSummary[]> {
    return this.ordersService.findAllForUser(user.id);
  }

  @Post()
  create(
    @CurrentUser() user: SessionUser,
    @Body() dto: CreateOrderDto,
  ): Promise<CreatedOrderResult> {
    return this.ordersService.create(user.id, dto);
  }
}
