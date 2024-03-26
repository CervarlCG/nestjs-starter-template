import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    
  });

  it('should be defined', () => {
  });
});
