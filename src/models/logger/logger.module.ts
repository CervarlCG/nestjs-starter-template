import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/logger.entity';
import { LoggerService } from './logger.service';
import { LoggingInterceptor } from './logger.interceptor';
import { RequestService } from '../request/request.service';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [LoggerService, LoggingInterceptor, RequestService],
  exports: [LoggingInterceptor, LoggerService]

})
export class LoggerModule {}
