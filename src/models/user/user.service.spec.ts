import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from "./entities/user.entity";
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { generateRandomEmail } from 'test/utils/auth';
import { generateRepositoryMock } from 'test/utils/repository';

describe('AuthService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  const userDto = { 
    firstName: 'unit', 
    lastName: 'test', 
    email: generateRandomEmail(), 
    password: 'password'
  }
  const userInstance = {...userDto, id: 1};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, JwtService, Repository<User>,
        {
          provide: getRepositoryToken(User),
          useValue: generateRepositoryMock([userInstance], {findWhereKey: "email"})
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    userInstance.password = await service.hashPassword(userInstance.password);
  });

  it('should define service and repository', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('Should create user and hash password', async () => {
    const newUserDto = {...userDto, email: generateRandomEmail()};
    const user = await service.create(newUserDto);

    expect(user).toBeDefined();
    expect(user).toEqual({...newUserDto, id: expect.any(Number), password: expect.any(String)});
    expect(user.password).not.toBe(newUserDto.password);

    const passwordMatch = await service.verifyPassword(user.password, newUserDto.password)
    expect(passwordMatch).toBe(true);
  });

  it('Should retrieve the user by email', async () => {
    const user = await service.findByEmail(userDto.email);
    expect(user).toBeDefined();
    expect(user).toEqual(userInstance);
  });

  it('Should delete the user by id', async () => {
    await service.delete(userInstance.id);
    expect(await service.findByEmail(userInstance.email)).toBe(null)
  });

  it('Should hash and verify password', async () => {
    const password = 'SECURE_PASSWORD_TEST';
    const hashed = await service.hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(await service.verifyPassword(hashed, password)).toBe(true)
  });

  it('Should update entities', async() => {
    const toChange = { firstName: 'Changed first name' };
    await service.update(userInstance.id, toChange);
    const user = await service.findByEmail(userInstance.email);
    expect(user).toEqual({...userInstance, ...toChange});
  })
});
