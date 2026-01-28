import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Learning Goals (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // imports
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/learning-goals/generate (POST)', () => {
    return request(app.getHttpServer())
      .post('/learning-goals/generate')
      .expect(201);
  });
});
