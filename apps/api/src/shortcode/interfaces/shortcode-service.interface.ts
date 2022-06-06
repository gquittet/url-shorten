import { CreateShortcodeDto } from '../dto/create-shortcode.dto';
import { ShortcodeEntity } from '../entities/shortcode.entity';

export interface IShortcodeService {
  create(createShortcodeDto: CreateShortcodeDto): Promise<ShortcodeEntity>;

  findOne(slug: string): Promise<ShortcodeEntity>;

  hit(slug: string): Promise<void>;
}

export const IShortcodeService = Symbol('IShortcodeService');
