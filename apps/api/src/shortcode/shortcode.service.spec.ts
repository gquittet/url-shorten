import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { ShortcodeEntity } from './entities/shortcode.entity';
import { ShortcodeService } from './shortcode.service';

describe('ShortcodeService', () => {
  const FAKE_URL = 'https://test.com';
  const FAKE_SLUG = 'testslug';
  const UPPERCASE_SLUG = 'TESTSLUG';
  let shortcode;

  let service: ShortcodeService;
  let repository: EntityRepository<ShortcodeEntity>;

  let mockedShortcodeRepository;

  beforeEach(async () => {
    shortcode = new ShortcodeEntity();
    mockedShortcodeRepository = {
      findOneOrFail: jest.fn().mockImplementation(async () => {
        shortcode.url = FAKE_URL;
        shortcode.slug = FAKE_SLUG;
        shortcode.hits = 4;
        return shortcode;
      }),

      findOne: jest.fn(),
      persistAndFlush: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortcodeService,
        {
          provide: getRepositoryToken(ShortcodeEntity),
          useValue: mockedShortcodeRepository,
        },
      ],
    }).compile();

    service = module.get<ShortcodeService>(ShortcodeService);
    repository = module.get<EntityRepository<ShortcodeEntity>>(
      getRepositoryToken(ShortcodeEntity)
    );
  });

  it('should be defined ', () => {
    expect(service).toBeDefined();
  });

  it('create should store on database', async () => {
    await service.create({ url: FAKE_URL, slug: FAKE_SLUG });
    expect(repository.persistAndFlush).toHaveBeenCalledTimes(1);
  });

  it('create should lowercase slug', async () => {
    const result = await service.create({
      url: FAKE_URL,
      slug: UPPERCASE_SLUG,
    });
    expect(result.slug).toBe(UPPERCASE_SLUG.toLowerCase());
  });

  it('create should return the created shortcode entity', async () => {
    const result = await service.create({ url: FAKE_URL, slug: FAKE_SLUG });

    const expected = new ShortcodeEntity();
    expected.slug = FAKE_SLUG;
    expected.url = FAKE_URL;

    expect(result.slug).toBe(expected.slug);
    expect(result.url).toBe(expected.url);
  });

  it('findOne should find in the database for one entry', async () => {
    await service.findOne(FAKE_SLUG);
    expect(repository.findOne).toHaveBeenCalledTimes(1);
  });

  it('findOne should lowercase the slug', async () => {
    await service.findOne(UPPERCASE_SLUG);
    expect(repository.findOne).toHaveBeenLastCalledWith({
      slug: UPPERCASE_SLUG.toLowerCase(),
    });
  });

  it('hit should look for one entry in the database', async () => {
    await service.hit(FAKE_SLUG);
    expect(repository.findOneOrFail).toHaveBeenCalledTimes(1);
  });

  it('hit should lowercase the slug', async () => {
    await service.hit(UPPERCASE_SLUG);
    expect(repository.findOneOrFail).toHaveBeenLastCalledWith({
      slug: UPPERCASE_SLUG.toLowerCase(),
    });
  });

  it('hit should increase the hits of the found shortcode', async () => {
    await service.hit(FAKE_SLUG);
    expect(shortcode.hits).toBe(4 + 1);
  });

  it('hit should store the updated shortcode', async () => {
    await service.hit(FAKE_SLUG);
    expect(repository.persistAndFlush).toHaveBeenCalledTimes(1);
  });
});
