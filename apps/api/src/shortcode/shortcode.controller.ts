import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShortcodeService } from './shortcode.service';
import { CreateShortcodeDto } from './dto/create-shortcode.dto';
import { UpdateShortcodeDto } from './dto/update-shortcode.dto';

@Controller('shortcode')
export class ShortcodeController {
  constructor(private readonly shortcodeService: ShortcodeService) {}

  @Post()
  create(@Body() createShortcodeDto: CreateShortcodeDto) {
    return this.shortcodeService.create(createShortcodeDto);
  }

  @Get()
  findAll() {
    return this.shortcodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shortcodeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShortcodeDto: UpdateShortcodeDto
  ) {
    return this.shortcodeService.update(+id, updateShortcodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shortcodeService.remove(+id);
  }
}
