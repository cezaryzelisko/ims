import { DataSource } from 'typeorm';
import { config } from '../../../utils';

export default new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  username: config.db.username,
  password: config.db.password,
  migrationsRun: config.db.runMigrations,
  migrations: ['src/unit-of-work/connectors/postgres-db/migrations/**/*{.js,.ts}'],
  synchronize: false,
  logging: false,
  entities: ['src/unit-of-work/connectors/postgres-db/entities/**/*{.js,.ts}'],
});
