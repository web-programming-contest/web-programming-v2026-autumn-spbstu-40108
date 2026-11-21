import { Global, Injectable, Module, OnApplicationShutdown } from '@nestjs/common';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DATABASE = Symbol('DATABASE');

export type Database = NodePgDatabase<typeof schema>;

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  private readonly pool: Pool;
  readonly db: Database;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('Не задана переменная окружения DATABASE_URL');
    }

    this.pool = new Pool({ connectionString });
    this.db = drizzle(this.pool, { schema });
  }

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: DATABASE,
      inject: [DatabaseService],
      useFactory: (databaseService: DatabaseService): Database => databaseService.db,
    },
  ],
  exports: [DATABASE, DatabaseService],
})
export class DatabaseModule {}
