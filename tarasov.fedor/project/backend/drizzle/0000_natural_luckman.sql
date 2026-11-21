CREATE TABLE "goods" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"specs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"price" integer NOT NULL,
	"rating" real NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"color" varchar(50) NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_bestseller" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"good_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price_at_purchase" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email" varchar(255),
	"phone" varchar(30) NOT NULL,
	"delivery_method" varchar(20) NOT NULL,
	"address" varchar(500),
	"payment_method" varchar(20) NOT NULL,
	"needs_packaging" boolean DEFAULT false NOT NULL,
	"total_quantity" integer NOT NULL,
	"total_price" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(64) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_good_id_goods_id_fk" FOREIGN KEY ("good_id") REFERENCES "public"."goods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "goods_category_idx" ON "goods" USING btree ("category");--> statement-breakpoint
CREATE INDEX "goods_color_idx" ON "goods" USING btree ("color");--> statement-breakpoint
CREATE INDEX "goods_price_idx" ON "goods" USING btree ("price");--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_good_id_idx" ON "order_items" USING btree ("good_id");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_username_idx" ON "users" USING btree ("username");