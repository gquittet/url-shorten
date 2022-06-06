import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { mikroOrmConfig } from '@url-shorten/mikro-orm-config';
import * as path from 'path';
import { ShortcodeEntity } from './shortcode/entities/shortcode.entity';

const config: MikroOrmModuleOptions = {
  ...mikroOrmConfig,
  entities: [ShortcodeEntity],
  migrations: {
    pathTs: path.join(__dirname, 'migrations'),
  },
};

export default config;
