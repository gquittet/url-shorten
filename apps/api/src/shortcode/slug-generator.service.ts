import { Injectable } from '@nestjs/common';
import { customAlphabet as nanoid } from 'nanoid';
import { GenerateString } from './interfaces/generate-string.interface';

const SLUG_SIZE = 6;
const SLUG_ALPHABET = '1234567890abcdefghijklmnopqrstuvwxyz';

@Injectable()
export class SlugGeneratorService implements GenerateString {
  next(): string {
    return nanoid(SLUG_ALPHABET)(SLUG_SIZE);
  }
}
