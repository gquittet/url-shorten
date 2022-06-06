import { NotFoundError } from '@mikro-orm/core';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StatsDto } from './dto/stats.dto';
import { ShortcodeEntity } from './entities/shortcode.entity';
import { GenerateString } from './interfaces/generate-string.interface';
import { IShortcodeService } from './interfaces/shortcode-service.interface';
import { ShortcodeController } from './shortcode.controller';

describe('ShortcodeController', () => {
  let controller: ShortcodeController;
  let service: IShortcodeService;
  let slugGeneratorService: GenerateString;
  const FAKE_URL = 'https://test.com';
  const FAKE_SLUG = 'testslug';
  const FIXED_SLUG = 'fixedslug123';

  let mockedService;
  let mockedSlugGeneratorService;

  const buildShortcode = () => {
    const shortcode = new ShortcodeEntity();
    shortcode.url = 'https://test.com';
    shortcode.slug = 'test';
    return shortcode;
  };

  beforeEach(async () => {
    mockedService = {
      create: jest
        .fn()
        .mockImplementation(
          async (): Promise<ShortcodeEntity> => buildShortcode()
        ),
      findOne: jest.fn().mockReturnValue(undefined),
      hit: jest.fn().mockReturnValue(undefined),
    };

    mockedSlugGeneratorService = {
      next: jest.fn().mockReturnValue(FIXED_SLUG),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortcodeController],
      providers: [
        {
          provide: IShortcodeService,
          useValue: mockedService,
        },
        {
          provide: GenerateString,
          useValue: mockedSlugGeneratorService,
        },
      ],
    }).compile();

    controller = module.get<ShortcodeController>(ShortcodeController);
    service = module.get<IShortcodeService>(IShortcodeService);
    slugGeneratorService = module.get<GenerateString>(GenerateString);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should check if a shortcode already exists with the same slug', () => {
    controller.create({ url: FAKE_URL, slug: FAKE_SLUG });
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('create should throw a BadRequestException if shortcode already exists', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(buildShortcode());
    try {
      await controller.create({ url: FAKE_URL, slug: FAKE_SLUG });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(e.message).toBe('Slug is already defined.');
    }
  });

  it('create should generate slug if not given', async () => {
    await controller.create({ url: FAKE_URL });
    expect(slugGeneratorService.next).toHaveBeenCalledTimes(1);
  });

  it('create should create a shortcode if everything is correct', async () => {
    await controller.create({ url: FAKE_URL, slug: FAKE_SLUG });
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('findOne should call hit of service', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(buildShortcode());
    await controller.findOne(FAKE_SLUG);
    expect(service.hit).toHaveBeenCalledTimes(1);
  });

  it('findOne should throw a NotFoundException if hit throw', async () => {
    jest.spyOn(service, 'hit').mockImplementation(() => {
      throw new NotFoundError('Not Found');
    });
    try {
      await controller.findOne(FAKE_SLUG);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('Slug does not exist.');
    }
  });

  it('findOne should return an url object', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(buildShortcode());

    const result = await controller.findOne(FAKE_SLUG);
    const expected = buildShortcode();
    expect(result).toEqual({ url: expected.url });
  });

  it('stats should call findOne', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(buildShortcode());

    await controller.stats(FAKE_SLUG);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('stats should throw a NotFoundException if the slug does not exists', async () => {
    try {
      await controller.stats(FAKE_SLUG);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('Slug does not exists.');
    }
  });

  it('stats should returns StatsDto based on found shortcode', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(buildShortcode());

    const result = await controller.stats(FAKE_SLUG);

    const shortcode = buildShortcode();
    const expected = new StatsDto();
    expected.hits = shortcode.hits;
    expected.createdAt = shortcode.createdAt;
    expected.lastAccessed = shortcode.updatedAt;

    expect(result.hits).toBe(expected.hits);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.lastAccessed).toBeInstanceOf(Date);
  });
});
