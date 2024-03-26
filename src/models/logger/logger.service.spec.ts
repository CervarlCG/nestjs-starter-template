import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { Log } from './entities/logger.entity';
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { LogLevel } from './types';

describe('AsdService', () => {
  let service: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService,
      {
        provide: getRepositoryToken(Log),
        useValue: { create: jest.fn(data => data), save: jest.fn((value: any) => ({...value, id: 1})) }
      }
      ],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it('should save a log record', async () => {
    const logRecord = {
      requestId: "12345678-1234",
      message: 'Unknown error',
      trace: 'Error: Unknown error',
      level: LogLevel.ERROR
    };
    const logged = await service.log(logRecord);
    expect(logged).toBeDefined();
    expect(logged).toEqual({...logRecord, id: 1})
  });

  it('should save a log from error', async () => {
    const error = new Error("Unknown error");
    const log = await service.error(error, "12345678-1234");
    expect(log).toBeDefined();
    expect(log).not.toBeNull();
    expect(log!.requestId).toEqual("12345678-1234")
    expect(log!.message).toEqual(error.message)
    expect(log!.trace).toEqual(error.stack)
  });
});
