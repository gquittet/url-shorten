import { Module } from '@nestjs/common';
import { ShortcodeService } from './shortcode.service';
import { ShortcodeController } from './shortcode.controller';

@Module({
  controllers: [ShortcodeController],
  providers: [ShortcodeService],
})
export class ShortcodeModule {}
