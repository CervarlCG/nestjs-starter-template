import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from "./entities/user.entity";
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { generateRepositoryMock } from 'test/utils/repository';
import { UserController } from './user.controller';
import {  users } from 'test/utils/user';
import { generateRandomEmail } from 'test/utils/auth';
import { UnauthorizedException } from 'src/common/exceptions/system';


describe('AuthService', () => {
  let service: UserService;
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, JwtService, Repository<User>,
        {
          provide: getRepositoryToken(User),
          useValue: generateRepositoryMock([...users], {findWhereKey: "email"})
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    controller = module.get<UserController>(UserController);
  });

  it('should define service and repository', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('Should retrieve logged in user', async () => {
    const expectedUser = users[0];
    jest.spyOn(service, 'findByEmail').mockImplementation(async (email) => (email === expectedUser.email ? expectedUser : null) as any );
    expect(await controller.getLoggedInUser({user: {email: expectedUser.email}})).toEqual(service.toDto(expectedUser));
  });

  it('Should throw unauthorized when authentication fails', async () => {
    const expectedUser = users[0];
    jest.spyOn(service, 'findByEmail').mockImplementation(async (email) => (email === expectedUser.email ? expectedUser : null) as any );
    expect(async () => await controller.getLoggedInUser({user: { email: generateRandomEmail() }})).rejects.toThrow(UnauthorizedException)
  })

});
