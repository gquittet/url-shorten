import { Test, TestingModule } from '@nestjs/testing';
import { ShortcodeController } from './shortcode.controller';
import { ShortcodeService } from './shortcode.service';

describe('ShortcodeController', () => {
  let controller: ShortcodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortcodeController],
      providers: [ShortcodeService],
    }).compile();

    controller = module.get<ShortcodeController>(ShortcodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
