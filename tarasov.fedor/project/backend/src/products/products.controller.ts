import { Controller, Get } from '@nestjs/common';
import type { Good } from '../database/schema';
import { ProductsService } from './products.service';

@Controller('goods')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<Good[]> {
    return this.productsService.findAll();
  }
}
