import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from './request.service';

describe('AsdService', () => {
  let service: RequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestService],
    }).compile();

    service = await module.resolve<RequestService>(RequestService);
  });

  it('should generate request id using uuid v4', () => {
    const requestId = service.id;

    expect(requestId).toBeDefined();
    expect(requestId.length).toBe(36);
    expect(typeof requestId).toBe("string");
    expect(requestId).toMatch(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)
  });
});
