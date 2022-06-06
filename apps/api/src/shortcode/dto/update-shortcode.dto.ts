import { PartialType } from '@nestjs/mapped-types';
import { CreateShortcodeDto } from './create-shortcode.dto';

export class UpdateShortcodeDto extends PartialType(CreateShortcodeDto) {}
