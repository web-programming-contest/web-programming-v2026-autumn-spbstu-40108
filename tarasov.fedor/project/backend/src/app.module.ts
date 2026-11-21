import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [DatabaseModule, AuthModule, ProductsModule, OrdersModule],
  controllers: [AppController],
})
export class AppModule {}
