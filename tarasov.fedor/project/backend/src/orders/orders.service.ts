import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { desc, eq, inArray } from 'drizzle-orm';
import { formatRussianDate } from '../common/utils/format-russian-date';
import { DATABASE, type Database } from '../database/database.module';
import { goods, orderItems, orders } from '../database/schema';
import type { CreateOrderDto } from './dto/create-order.dto';

const PAYMENT_METHOD_TO_DATABASE = {
  'По карте': 'card',
  'Наличными': 'cash',
} as const;

export interface OrderSummary {
  orderNumber: number;
  date: string;
  totalQuantity: number;
  totalPrice: number;
}

export interface CreatedOrderResult extends OrderSummary {
  message: string;
}

@Injectable()
export class OrdersService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findAllForUser(userId: number): Promise<OrderSummary[]> {
    const userOrders = await this.db
      .select({
        id: orders.id,
        createdAt: orders.createdAt,
        totalQuantity: orders.totalQuantity,
        totalPrice: orders.totalPrice,
      })
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt), desc(orders.id));

    return userOrders.map((order) => ({
      orderNumber: order.id,
      date: formatRussianDate(order.createdAt),
      totalQuantity: order.totalQuantity,
      totalPrice: order.totalPrice,
    }));
  }

  async create(
    userId: number,
    dto: CreateOrderDto,
  ): Promise<CreatedOrderResult> {
    const goodIds = dto.items.map((item) => item.goodId);

    if (dto.phone.length > 30) {
      throw new BadRequestException(
        'Номер телефона не должен превышать 30 символов',
      );
    }

    if (new Set(goodIds).size !== goodIds.length) {
      throw new BadRequestException(
        'Товар не может быть указан в заказе несколько раз',
      );
    }

    if (dto.deliveryMethod === 'delivery') {
      if (!dto.address) {
        throw new BadRequestException('Укажите адрес доставки');
      }

      if (dto.address.length > 500) {
        throw new BadRequestException(
          'Адрес доставки не должен превышать 500 символов',
        );
      }
    }

    return this.db.transaction(async (tx) => {
      const foundGoods = await tx
        .select()
        .from(goods)
        .where(inArray(goods.id, goodIds));

      if (foundGoods.length !== goodIds.length) {
        throw new BadRequestException(
          'Некоторые товары не найдены. Обновите корзину и попробуйте снова.',
        );
      }

      const goodsById = new Map(foundGoods.map((good) => [good.id, good]));

      const itemsToSave = dto.items.map((item) => {
        const good = goodsById.get(item.goodId);

        if (!good) {
          throw new BadRequestException(
            'Некоторые товары не найдены. Обновите корзину и попробуйте снова.',
          );
        }

        return {
          goodId: item.goodId,
          quantity: item.quantity,
          priceAtPurchase: good.price,
        };
      });

      const totalQuantity = itemsToSave.reduce(
        (total, item) => total + item.quantity,
        0,
      );

      const totalPrice = itemsToSave.reduce(
        (total, item) => total + item.quantity * item.priceAtPurchase,
        0,
      );

      const [order] = await tx
        .insert(orders)
        .values({
          userId,
          email: dto.email ?? null,
          phone: dto.phone,
          deliveryMethod: dto.deliveryMethod,
          address:
            dto.deliveryMethod === 'delivery' ? dto.address!.trim() : null,
          paymentMethod: PAYMENT_METHOD_TO_DATABASE[dto.paymentMethod],
          needsPackaging: dto.needsPackaging,
          totalQuantity,
          totalPrice,
        })
        .returning();

      if (!order) {
        throw new BadRequestException(
          'Не удалось создать заказ. Попробуйте снова.',
        );
      }

      await tx.insert(orderItems).values(
        itemsToSave.map((item) => ({
          orderId: order.id,
          ...item,
        })),
      );

      return {
        orderNumber: order.id,
        date: formatRussianDate(order.createdAt),
        totalQuantity,
        totalPrice,
        message: 'Заказ успешно оформлен',
      };
    });
  }
}
