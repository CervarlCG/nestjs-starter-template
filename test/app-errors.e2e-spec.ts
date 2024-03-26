import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from 'src/app.service';
import { messageForNoExposeError } from 'src/common/constants/exceptions';
import { LoggerService } from 'src/models/logger/logger.service';


describe('AppController (e2e)', () => {
  let app: INestApplication;
  let loggerService: LoggerService;
  let requestId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(AppService)
    .useValue({getStatus: () => {
      throw new Error("Unknown error");
    }})
    .compile();

    app = moduleFixture.createNestApplication();
    loggerService = await app.resolve(LoggerService);
    await app.init();
  });

  afterEach(async () => {
    await loggerService.remove(requestId);
    await app.close();
  });

  it('Should return 500 error', async () => {
    const response = await request(app.getHttpServer()).get("/status");
    const log = await loggerService.find(response.body.requestId);
    requestId = response.body.requestId;
    
    expect(response.status).toEqual(500);
    expect(response.body.statusCode).toEqual(500);
    expect(response.body.message).toEqual(messageForNoExposeError);
    expect( log?.requestId ).toBe(response.body.requestId);
  });
});
