import { Test, TestingModule } from '@nestjs/testing';
import { ShortcodeService } from './shortcode.service';

describe('ShortcodeService', () => {
  let service: ShortcodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortcodeService],
    }).compile();

    service = module.get<ShortcodeService>(ShortcodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
