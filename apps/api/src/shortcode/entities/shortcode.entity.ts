import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Shortcode, ShortcodeStatus } from '@url-shorten/api-interfaces';
import { v4 as uuidV4 } from 'uuid';

export const URL_MAX_LENGTH = 2048;
export const SLUG_MIN_LENGTH = 4;
export const SLUG_MAX_LENGTH = 255;

@Entity({ tableName: 'shortcode' })
export class ShortcodeEntity implements Shortcode {
  @PrimaryKey()
  id: string = uuidV4();

  @Property({ length: SLUG_MAX_LENGTH })
  @Unique()
  slug: string;

  @Property({ length: URL_MAX_LENGTH })
  @Index()
  url: string;

  @Property({ default: 0 })
  hits!: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Enum(() => ShortcodeStatus)
  status: ShortcodeStatus = ShortcodeStatus.ENABLED;
}
