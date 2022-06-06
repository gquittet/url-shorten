import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ShortcodeEntity } from './entities/shortcode.entity';
import { GenerateString } from './interfaces/generate-string.interface';
import { IShortcodeService } from './interfaces/shortcode-service.interface';
import { ShortcodeController } from './shortcode.controller';
import { ShortcodeService } from './shortcode.service';
import { SlugGeneratorService } from './slug-generator.service';

@Module({
  controllers: [ShortcodeController],
  imports: [MikroOrmModule.forFeature({ entities: [ShortcodeEntity] })],
  providers: [
    {
      provide: IShortcodeService,
      useClass: ShortcodeService,
    },
    {
      provide: GenerateString,
      useClass: SlugGeneratorService,
    },
  ],
})
export class ShortcodeModule {}
