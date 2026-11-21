import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export type GoodSpecs = Record<string, string>;

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 64 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('users_username_idx').on(table.username)],
);

export const goods = pgTable(
  'goods',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    specs: jsonb('specs').$type<GoodSpecs>().notNull().default({}),
    price: integer('price').notNull(),
    rating: real('rating').notNull(),
    imageUrl: varchar('image_url', { length: 255 }).notNull(),
    category: varchar('category', { length: 100 }).notNull(),
    color: varchar('color', { length: 50 }).notNull(),
    isNew: boolean('is_new').default(false).notNull(),
    isBestseller: boolean('is_bestseller').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('goods_category_idx').on(table.category),
    index('goods_color_idx').on(table.color),
    index('goods_price_idx').on(table.price),
    check('goods_price_check', sql`${table.price} >= 0`),
    check(
      'goods_rating_check',
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
    ),
  ],
);

export const orders = pgTable(
  'orders',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 30 }).notNull(),
    deliveryMethod: varchar('delivery_method', { length: 20 }).notNull(),
    address: varchar('address', { length: 500 }),
    paymentMethod: varchar('payment_method', { length: 20 }).notNull(),
    needsPackaging: boolean('needs_packaging').default(false).notNull(),
    totalQuantity: integer('total_quantity').notNull(),
    totalPrice: integer('total_price').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('orders_user_id_idx').on(table.userId),
    index('orders_created_at_idx').on(table.createdAt),
    check(
      'orders_delivery_method_check',
      sql`${table.deliveryMethod} IN ('pickup', 'delivery')`,
    ),
    check(
      'orders_payment_method_check',
      sql`${table.paymentMethod} IN ('card', 'cash')`,
    ),
    check('orders_total_quantity_check', sql`${table.totalQuantity} > 0`),
    check('orders_total_price_check', sql`${table.totalPrice} >= 0`),
  ],
);

export const orderItems = pgTable(
  'order_items',
  {
    id: serial('id').primaryKey(),
    orderId: integer('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    goodId: integer('good_id')
      .notNull()
      .references(() => goods.id),
    quantity: integer('quantity').notNull(),
    priceAtPurchase: integer('price_at_purchase').notNull(),
  },
  (table) => [
    index('order_items_order_id_idx').on(table.orderId),
    index('order_items_good_id_idx').on(table.goodId),
    check('order_items_quantity_check', sql`${table.quantity} > 0`),
    check(
      'order_items_price_at_purchase_check',
      sql`${table.priceAtPurchase} >= 0`,
    ),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Good = typeof goods.$inferSelect;
export type NewGood = typeof goods.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
