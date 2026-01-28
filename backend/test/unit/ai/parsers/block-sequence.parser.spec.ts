import { Test, TestingModule } from '@nestjs/testing';

describe('BlockSequenceParser', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // providers
    }).compile();
  });

  it('should be defined', () => {
    expect(true).toBeDefined();
  });
});
