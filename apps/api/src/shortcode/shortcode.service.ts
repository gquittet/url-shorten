import { Injectable } from '@nestjs/common';
import { CreateShortcodeDto } from './dto/create-shortcode.dto';
import { UpdateShortcodeDto } from './dto/update-shortcode.dto';

@Injectable()
export class ShortcodeService {
  create(createShortcodeDto: CreateShortcodeDto) {
    return 'This action adds a new shortcode';
  }

  findAll() {
    return `This action returns all shortcode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shortcode`;
  }

  update(id: number, updateShortcodeDto: UpdateShortcodeDto) {
    return `This action updates a #${id} shortcode`;
  }

  remove(id: number) {
    return `This action removes a #${id} shortcode`;
  }
}
