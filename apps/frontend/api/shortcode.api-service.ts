import { Shortcode } from '@url-shorten/api-interfaces';
import axios from 'axios';
import { ApiService } from './api-service.interface';

export class ShortcodeApiService implements ApiService<Shortcode> {
  async create(body: Shortcode): Promise<Shortcode> {
    return (await axios.post('/api/shortcode/', body)).data;
  }

  async find(body: Partial<Shortcode>): Promise<Shortcode> {
    return (await axios.get(`/api/shortcode/${body.slug}`)).data;
  }
}
