import * as dotenv from 'dotenv';

import { ApiConfig } from './api-config';
import { DbConfig } from './db-config';

class Config {
  readonly api: ApiConfig;
  readonly db: DbConfig;

  constructor() {
    dotenv.config({ debug: false, quiet: true });

    this.api = {
      port: Number(process.env.API_PORT) || 3000,
      isProductionEnv: process.env.NODE_ENV === 'production',
      secret: process.env.API_SECRET || 'secret',
    };
    this.db = {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_DATABASE || 'postgres',
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      runMigrations: process.env.DB_RUN_MIGRATIONS === 'true',
    };
  }
}

export const config = new Config();
