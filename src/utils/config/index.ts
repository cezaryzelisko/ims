import * as dotenv from 'dotenv';

import { ApiConfig } from './api-config';

class Config {
  readonly api: ApiConfig;

  constructor() {
    dotenv.config({ debug: false, quiet: true });

    this.api = {
      port: Number(process.env.API_PORT) || 3000,
      isProductionEnv: process.env.NODE_ENV === 'production',
    };
  }
}

export const config = new Config();
