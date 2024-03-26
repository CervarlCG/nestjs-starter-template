import { Module } from '@nestjs/common';
import { HttpInterceptor } from './http.interceptor';
import { RequestService } from '../request/request.service';

@Module({
  providers: [HttpInterceptor, RequestService],
  exports: [HttpInterceptor]

})
export class HttpModule {}
