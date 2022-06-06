export enum ShortcodeStatus {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
}

export interface Shortcode {
  id: string;
  slug: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  hits: number;
  status: ShortcodeStatus;
}

export interface ShortcodeUrl {
  url: string;
}

export interface ShortcodeSlug {
  slug: string;
}

export interface ShortcodeStats {
  hits: number;
  createdAt: Date;
  lastAccessed: Date;
}

export interface CreateShortcode {
  slug?: string;
  url: string;
}
