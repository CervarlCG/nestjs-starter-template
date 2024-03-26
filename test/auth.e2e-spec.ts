import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { createUserAndLogin, generateRandomEmail, jwtPattern } from './utils/auth';
import { UserService } from 'src/models/user/user.service';


describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let userId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = app.get(UserService);
    await app.init();
  });

  afterEach(async () => {
    await userService.delete(userId, {hardDelete: true});
    await app.close();
  });

  it('Should create a user successfully, allow login, retrieve user and refresh token', async () => {
    let tokens: Record<string, string> = {};
    const { signUp, login } = await createUserAndLogin(app.getHttpServer());
    userId = signUp.request.body.id;

    expect(signUp.request.body).toEqual(signUp.expectedUser);
    expect(signUp.request.body.id).toBeGreaterThan(0);

    expect(login.request.body.user).toEqual(signUp.expectedUser);
    expect(login.request.body.token.accessToken).toMatch(jwtPattern);
    expect(login.request.body.token.refreshToken).toMatch(jwtPattern);
    tokens = login.request.body.token;

    const me = await request(app.getHttpServer())
      .get("/users/me")
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .expect(200);

    expect(me.body).toEqual(signUp.expectedUser);

    const tokensRefreshed = await request(app.getHttpServer())
      .post("/auth/refresh-token")
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .send({refreshToken: tokens.refreshToken});

    expect(tokensRefreshed.body.accessToken).toMatch(jwtPattern);
    expect(tokensRefreshed.body.refreshToken).toMatch(jwtPattern);
    // NOTE: We dont test for not equality due it generates the same token is a very short time. See [https://stackoverflow.com/questions/58950775/jsonwebtoken-has-same-value-in-requests-done-within-1-second] 

    await request(app.getHttpServer())
      .get("/users/me")
      .expect(401);
  });
});
