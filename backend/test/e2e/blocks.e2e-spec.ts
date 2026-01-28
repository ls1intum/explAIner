import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Blocks (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // imports
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/blocks (POST)', () => {
    return request(app.getHttpServer())
      .post('/blocks')
      .expect(201);
  });
});
