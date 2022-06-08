import { NotFoundError } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateShortcodeDto } from '../shortcode/dto/create-shortcode.dto';
import { ShortcodeEntity } from '../shortcode/entities/shortcode.entity';
import { GenerateString } from '../shortcode/interfaces/generate-string.interface';
import { IShortcodeService } from '../shortcode/interfaces/shortcode-service.interface';
import { ShortcodeModule } from '../shortcode/shortcode.module';

describe('Shortcode e2e', () => {
  let app: INestApplication;
  const FAKE_URL = 'https://test.com';
  const FAKE_SLUG = 'fakeslug';
  const FIXED_SLUG = 'fixedslug';

  const buildShortcodeEntity = (): ShortcodeEntity => {
    const shortcode = new ShortcodeEntity();
    shortcode.url = FAKE_URL;
    shortcode.slug = FAKE_SLUG;
    shortcode.hits = 4;
    return shortcode;
  };

  const shortcodeService = {
    findOne: jest
      .fn()
      .mockImplementation(
        async (): Promise<ShortcodeEntity> => buildShortcodeEntity()
      ),
    create: jest
      .fn()
      .mockImplementation(
        async (
          createShortcodeDto: CreateShortcodeDto
        ): Promise<ShortcodeEntity> => {
          const shortcode = new ShortcodeEntity();
          shortcode.slug = createShortcodeDto.slug;
          shortcode.url = createShortcodeDto.url;
          return shortcode;
        }
      ),
    hit: jest.fn().mockImplementation((): Promise<void> => {
      throw new NotFoundError('Not found.');
    }),
  };

  // noinspection JSUnusedGlobalSymbols
  const slugGeneratorService = { next: () => FIXED_SLUG };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ShortcodeModule],
    })
      .overrideProvider(getRepositoryToken(ShortcodeEntity))
      .useValue({})
      .overrideProvider(GenerateString)
      .useValue(slugGeneratorService)
      .overrideProvider(IShortcodeService)
      .useValue(shortcodeService)
      .compile();

    app = moduleRef.createNestApplication();
    // Use body validation
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it(`/POST shortcode submit`, () => {
    jest.spyOn(shortcodeService, 'findOne').mockReturnValueOnce(undefined);

    return request(app.getHttpServer())
      .post('/shortcode/submit')
      .send({
        url: FAKE_URL,
        slug: FAKE_SLUG,
      })
      .expect(201)
      .expect({
        slug: FAKE_SLUG,
      });
  });

  it(`/POST shortcode submit 400 if slug exist`, () => {
    return request(app.getHttpServer())
      .post('/shortcode/submit')
      .send({
        url: FAKE_URL,
        slug: FAKE_SLUG,
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Slug is already defined.',
        error: 'Bad Request',
      });
  });

  it(`/POST shortcode submit 400 if no url`, () => {
    return request(app.getHttpServer())
      .post('/shortcode/submit')
      .send({})
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['url must be an URL address'],
        error: 'Bad Request',
      });
  });

  it(`/GET shortcode slug not found`, () => {
    return request(app.getHttpServer())
      .get(`/shortcode/${FAKE_SLUG}`)
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Slug does not exist.',
        error: 'Not Found',
      });
  });

  it(`/GET shortcode slug found`, () => {
    jest.spyOn(shortcodeService, 'hit').mockReturnValueOnce(undefined);

    return request(app.getHttpServer())
      .get(`/shortcode/${FAKE_SLUG}`)
      .expect(200)
      .expect({
        url: buildShortcodeEntity().url,
      });
  });

  it(`/GET shortcode stats not found`, () => {
    jest.spyOn(shortcodeService, 'findOne').mockReturnValueOnce(undefined);

    return request(app.getHttpServer())
      .get(`/shortcode/${FAKE_SLUG}/stats`)
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Slug does not exists.',
        error: 'Not Found',
      });
  });

  it(`/GET shortcode stats found`, () => {
    const shortcode = buildShortcodeEntity();
    jest.spyOn(shortcodeService, 'hit').mockReturnValueOnce(undefined);
    jest.spyOn(shortcodeService, 'findOne').mockResolvedValueOnce(shortcode);

    return request(app.getHttpServer())
      .get(`/shortcode/${FAKE_SLUG}/stats`)
      .expect(200)
      .expect(
        JSON.stringify({
          hits: shortcode.hits,
          createdAt: shortcode.createdAt,
          lastAccessed: shortcode.updatedAt,
        })
      );
  });

  afterAll(async () => {
    await app.close();
  });
});
