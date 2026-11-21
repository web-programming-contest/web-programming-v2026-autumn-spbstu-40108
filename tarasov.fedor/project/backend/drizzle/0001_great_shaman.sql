ALTER TABLE "goods" ADD CONSTRAINT "goods_price_check" CHECK ("goods"."price" >= 0);--> statement-breakpoint
ALTER TABLE "goods" ADD CONSTRAINT "goods_rating_check" CHECK ("goods"."rating" >= 1 AND "goods"."rating" <= 5);--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_quantity_check" CHECK ("order_items"."quantity" > 0);--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_price_at_purchase_check" CHECK ("order_items"."price_at_purchase" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_method_check" CHECK ("orders"."delivery_method" IN ('pickup', 'delivery'));--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_method_check" CHECK ("orders"."payment_method" IN ('card', 'cash'));--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_quantity_check" CHECK ("orders"."total_quantity" > 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_price_check" CHECK ("orders"."total_price" >= 0);