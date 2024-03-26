import * as request from 'supertest';
export const jwtPattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.([A-Za-z0-9-_=]+)?$/

export function generateRandomEmail() {
  const username = generateRandomValue();
  const domain = 'testing';
  const tld = '.com';
  return `${username}@${domain}${tld}`;
}


export function generateRandomValue(length = 20) {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let value = '';
  for (let i = 0; i < length; i++) {
    value += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return value;
}

export async function createUser(server: any) {
  const userDto = {
    firstName: 'e2e',
    lastName: 'test',
    email: generateRandomEmail(),
    password: 'password'
  }
  const expectedUser = { firstName: userDto.firstName, lastName: userDto.lastName, email: userDto.email, id: expect.any(Number) };
  const signUp = await request(server)
      .post("/auth/register")
      .send(userDto)
      .expect(201);
  return { userDto, expectedUser, request: signUp };
}

export async function createUserAndLogin(server: any) {
  const signUp = await createUser(server);
  const login = await request(server)
      .post("/auth/login")
      .send({email: signUp.userDto.email, password: signUp.userDto.password})
      .expect(201);
  return { signUp, login: { request: login} }
}