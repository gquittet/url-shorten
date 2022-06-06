import { ApiProperty } from '@nestjs/swagger';
import { CreateShortcode } from '@url-shorten/api-interfaces';
import {
  IsAlphanumeric,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  SLUG_MAX_LENGTH,
  SLUG_MIN_LENGTH,
  URL_MAX_LENGTH,
} from '../entities/shortcode.entity';

export class CreateShortcodeDto implements CreateShortcode {
  @IsUrl()
  @ApiProperty({ required: true, maxLength: URL_MAX_LENGTH })
  url: string;

  @IsAlphanumeric()
  @MinLength(SLUG_MIN_LENGTH, { message: 'Slug is too short.' })
  @MaxLength(SLUG_MAX_LENGTH, { message: 'Slug is too big.' })
  @IsOptional()
  @ApiProperty({
    required: false,
    minLength: SLUG_MIN_LENGTH,
    maxLength: SLUG_MAX_LENGTH,
  })
  slug?: string;
}
