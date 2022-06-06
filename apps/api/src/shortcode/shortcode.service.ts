import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CreateShortcodeDto } from './dto/create-shortcode.dto';
import { ShortcodeEntity } from './entities/shortcode.entity';
import { IShortcodeService } from './interfaces/shortcode-service.interface';

@Injectable()
export class ShortcodeService implements IShortcodeService {
  constructor(
    @InjectRepository(ShortcodeEntity)
    private readonly shortcodeRepository: EntityRepository<ShortcodeEntity>
  ) {}

  async create(
    createShortcodeDto: CreateShortcodeDto
  ): Promise<ShortcodeEntity> {
    const shortcode = new ShortcodeEntity();
    shortcode.url = createShortcodeDto.url;
    shortcode.slug = createShortcodeDto.slug.toLowerCase();
    await this.shortcodeRepository.persistAndFlush(shortcode);
    return shortcode;
  }

  findOne(slug: string): Promise<ShortcodeEntity> {
    return this.shortcodeRepository.findOne({
      slug: slug.toLowerCase(),
    });
  }

  async hit(slug: string): Promise<void> {
    const shortcode = await this.shortcodeRepository.findOneOrFail({
      slug: slug.toLowerCase(),
    });
    shortcode.hits += 1;
    return this.shortcodeRepository.persistAndFlush(shortcode);
  }
}
