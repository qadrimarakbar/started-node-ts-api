import type { Knex } from 'knex';
import { ENV } from './src/config/env';

const baseConnection: Knex.MySql2ConnectionConfig = {
  host: ENV.DATABASE.HOST,
  port: ENV.DATABASE.PORT,
  user: ENV.DATABASE.USER,
  password: ENV.DATABASE.PASSWORD,
  database: ENV.DATABASE.NAME,
};

const sharedConfig: Knex.Config = {
  client: 'mysql2',
  connection: baseConnection,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './database/migrations',
    extension: 'ts',
    tableName: 'knex_migrations',
  },
};

const config: Record<string, Knex.Config> = {
  development: {
    ...sharedConfig,
    connection: { ...baseConnection },
  },
  production: {
    ...sharedConfig,
    connection: { ...baseConnection },
  },
  test: {
    ...sharedConfig,
    connection: {
      ...baseConnection,
      database: process.env.DB_NAME_TEST || `${ENV.DATABASE.NAME}_test`,
    },
  },
};

export default config;
