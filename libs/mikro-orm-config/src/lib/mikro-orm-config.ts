import { LoadStrategy } from '@mikro-orm/core';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { Logger } from '@nestjs/common';

if (!process.env.DB_URL) {
  console.error('Missing DB_URL environment variable.');
  process.exit(1);
}

export const mikroOrmConfig: MikroOrmModuleOptions = {
  type: 'postgresql',
  clientUrl: process.env.DB_URL,
  forceUndefined: true,
  debug: ['info', 'query', 'query-params'],
  logger: (msg) => Logger.debug(msg),
  loadStrategy: LoadStrategy.JOINED,
  registerRequestContext: false,
};
