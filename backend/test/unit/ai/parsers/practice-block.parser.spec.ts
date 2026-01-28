import { Test, TestingModule } from '@nestjs/testing';

describe('PracticeBlockParser', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // providers
    }).compile();
  });

  it('should be defined', () => {
    expect(true).toBeDefined();
  });
});
