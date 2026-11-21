import 'dotenv/config';
import { hash } from 'bcryptjs';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { adminSeed, goodsSeed } from './seed-data';

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://gadget:gadget@localhost:5432/gadget_hub';

const pool = new Pool({ connectionString });
const db = drizzle(pool, { schema });

async function seed(): Promise<void> {
  console.log('Очистка таблиц и подготовка демонстрационных данных...');

  await db.transaction(async (tx) => {
    await tx.execute(
      sql`TRUNCATE TABLE order_items, orders, goods, users RESTART IDENTITY CASCADE`,
    );

    const passwordHash = await hash(adminSeed.password, 10);

    await tx.insert(schema.users).values({
      username: adminSeed.username,
      passwordHash,
    });

    await tx.insert(schema.goods).values(goodsSeed);

    await tx.execute(
      sql`SELECT setval(pg_get_serial_sequence('goods', 'id'), (SELECT MAX(id) FROM goods))`,
    );
  });

  console.log(
    `Готово: создан пользователь «${adminSeed.username}» и ${goodsSeed.length} товаров каталога.`,
  );
}

seed()
  .catch((error: unknown) => {
    console.error('Не удалось наполнить базу данных:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
