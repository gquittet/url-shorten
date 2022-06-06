import { ShortcodeStats } from '@url-shorten/api-interfaces';

export class StatsDto implements ShortcodeStats {
  hits: number;
  createdAt: Date;
  lastAccessed: Date;
}
