import { Inject, Injectable } from '@nestjs/common';
import { desc } from 'drizzle-orm';
import { DATABASE, type Database } from '../database/database.module';
import { goods, type Good } from '../database/schema';

@Injectable()
export class ProductsService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findAll(): Promise<Good[]> {
    return this.db
      .select()
      .from(goods)
      .orderBy(desc(goods.createdAt), desc(goods.id));
  }
}
