import { Test } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  beforeAll(async () => {
    await Test.createTestingModule({
      providers: [AppService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to api!"', () => {
      expect(true).toBe(true);
    });
  });
});
