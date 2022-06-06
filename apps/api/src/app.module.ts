import { EntityManager, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { APP_GUARD, NestFactory } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AsyncLocalStorage } from 'async_hooks';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import mikroOrmConfig from './mikro-orm.config';
import { ShortcodeModule } from './shortcode/shortcode.module';

// create new (global) storage instance
const storage = new AsyncLocalStorage<EntityManager>();

const TEN_SECONDS = 10;
const TEN_CALLS = 10;

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: TEN_SECONDS,
      limit: TEN_CALLS,
    }),
    MikroOrmModule.forRoot({
      ...mikroOrmConfig,
      registerRequestContext: false,
      context: () => storage.getStore(),
    }),
    LoggerModule.forRoot(),
    ShortcodeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

(async () => {
  const app = await NestFactory.create(AppModule);

  const orm = app.get(MikroORM);
  app.use((req, res, next) => {
    storage.run(orm.em.fork({ useContext: true }), next);
  });
})();
