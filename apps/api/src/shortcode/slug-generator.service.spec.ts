import { SlugGeneratorService } from './slug-generator.service';

describe('SlugGeneratorService', () => {
  it('should return a string with 6 characters long', () => {
    const service = new SlugGeneratorService();
    expect(service.next()).toHaveLength(6);
  });
});
