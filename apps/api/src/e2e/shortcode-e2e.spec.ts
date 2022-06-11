import { NotFoundError } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateShortcodeDto } from '../shortcode/dto/create-shortcode.dto';
import { ShortcodeEntity } from '../shortcode/entities/shortcode.entity';
import { GenerateString } from '../shortcode/interfaces/generate-string.interface';
import { IShortcodeService } from '../shortcode/interfaces/shortcode-service.interface';
import { ShortcodeModule } from '../shortcode/shortcode.module';

describe('Shortcode e2e', () => {
  let app: INestApplication;
  const FIXED_SLUG = 'fixedslug';

  const buildShortcodeEntity = (): ShortcodeEntity => {
    const shortcode = new ShortcodeEntity();
    shortcode.url = 'https://test.com';
    shortcode.slug = 'e2eSlug';
    shortcode.hits = 4;
    return shortcode;
  };

  const shortcodeService = {
    findOne: jest.fn().mockResolvedValue(buildShortcodeEntity()),
    create: jest
      .fn()
      .mockImplementation(
        async (createShortcodeDto: CreateShortcodeDto): Promise<ShortcodeEntity> => {
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

  describe('POST /', () => {
    it(`should create shortcode`, async () => {
      const shortcode = buildShortcodeEntity();
      jest.spyOn(shortcodeService, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(shortcodeService, 'create').mockResolvedValueOnce(shortcode);

      const response = await request(app.getHttpServer()).post('/shortcode').send({
        url: shortcode.url,
        slug: shortcode.slug,
      });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.header).toHaveProperty('location');
      expect(response.header.location).toBe(`/api/shortcode/${shortcode.slug}`);
      expect(response.body).toEqual(JSON.parse(JSON.stringify(shortcode)));
    });

    it(`should return 400 if shortcode exist`, async () => {
      const shortcode = buildShortcodeEntity();
      const response = await request(app.getHttpServer()).post('/shortcode').send({
        url: shortcode.url,
        slug: shortcode.slug,
      });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Slug is already defined.',
        error: 'Bad Request',
      });
    });

    it(`should return 400 if no url`, async () => {
      const response = await request(app.getHttpServer()).post('/shortcode').send({});

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['url must be an URL address'],
        error: 'Bad Request',
      });
    });
  });

  describe('GET /:slug', () => {
    it(`should return 404 if shortcode not found`, async () => {
      const shortcode = buildShortcodeEntity();
      const response = await request(app.getHttpServer()).get(
        `/shortcode/${shortcode.slug}`
      );

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Slug does not exist.',
        error: 'Not Found',
      });
    });

    it(`should redirect if shortcode found`, async () => {
      const shortcode = buildShortcodeEntity();
      jest.spyOn(shortcodeService, 'hit').mockResolvedValueOnce(undefined);

      const response = await request(app.getHttpServer()).get(
        `/shortcode/${shortcode.slug}`
      );

      expect(response.status).toBe(HttpStatus.TEMPORARY_REDIRECT);
      expect(response.header).toHaveProperty('location');
      expect(response.header.location).toBe(shortcode.url);
    });

    describe('GET /:slug/stats', () => {
      it(`should return 404 if shortcode not found`, async () => {
        const shortcode = buildShortcodeEntity();
        jest.spyOn(shortcodeService, 'findOne').mockResolvedValueOnce(undefined);

        const response = await request(app.getHttpServer()).get(
          `/shortcode/${shortcode.slug}/stats`
        );

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(response.body).toEqual({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Slug does not exists.',
          error: 'Not Found',
        });
      });

      it(`should return 200 with stats if shortcode found`, async () => {
        const shortcode = buildShortcodeEntity();
        jest.spyOn(shortcodeService, 'hit').mockResolvedValueOnce(undefined);
        jest.spyOn(shortcodeService, 'findOne').mockResolvedValueOnce(shortcode);

        const response = await request(app.getHttpServer()).get(
          `/shortcode/${shortcode.slug}/stats`
        );

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual(
          JSON.parse(
            JSON.stringify({
              hits: shortcode.hits,
              createdAt: shortcode.createdAt,
              lastAccessed: shortcode.updatedAt,
            })
          )
        );
      });
    });

    afterAll(async () => {
      await app.close();
    });
  });
});
