import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Do not remove
  @Get("/status")
  getStatus(): string {
    return this.appService.getStatus();
  }

}
