import { NotFoundError } from '@mikro-orm/core';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Redirect,
  Res,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ShortcodeStats } from '@url-shorten/api-interfaces';
import { Response } from 'express';
import { CreateShortcodeDto } from './dto/create-shortcode.dto';
import { StatsDto } from './dto/stats.dto';
import { GenerateString } from './interfaces/generate-string.interface';
import { IShortcodeService } from './interfaces/shortcode-service.interface';

@ApiTags('shortcode')
@Controller('shortcode')
export class ShortcodeController {
  constructor(
    @Inject(IShortcodeService)
    private readonly shortcodeService: IShortcodeService,
    @Inject(GenerateString) private readonly slugGenerator: GenerateString
  ) {}

  @ApiBadRequestResponse({ description: 'Slug is already defined.' })
  @ApiCreatedResponse({ description: '{slug: your_url_slug}' })
  @Post('/')
  async create(@Body() createShortcodeDto: CreateShortcodeDto, @Res() res: Response) {
    if (!createShortcodeDto.slug) {
      createShortcodeDto.slug = this.slugGenerator.next();
    }

    const result = await this.shortcodeService.findOne(createShortcodeDto.slug);

    if (result) {
      throw new BadRequestException('Slug is already defined.');
    }

    const shortcode = await this.shortcodeService.create(createShortcodeDto);
    return res
      .setHeader('Location', `/api/shortcode/${shortcode.slug}`)
      .json(shortcode);
  }

  @Get(':slug')
  @Redirect()
  async findOne(@Param('slug') slug: string) {
    try {
      await this.shortcodeService.hit(slug);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException('Slug does not exist.');
      }
    }
    const shortcode = await this.shortcodeService.findOne(slug);
    return { url: shortcode.url, statusCode: HttpStatus.TEMPORARY_REDIRECT };
  }

  @Get(':slug/stats')
  async stats(@Param('slug') slug: string): Promise<ShortcodeStats> {
    const shortcode = await this.shortcodeService.findOne(slug);

    if (!shortcode) {
      throw new NotFoundException('Slug does not exists.');
    }

    const stats = new StatsDto();
    stats.hits = shortcode.hits;
    stats.createdAt = shortcode.createdAt;
    stats.lastAccessed = shortcode.updatedAt;

    return stats;
  }
}
