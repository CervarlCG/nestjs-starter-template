import { User } from "src/models/user/entities/user.entity";
import { generateRandomEmail, generateRandomValue } from "./auth";
import * as bcrypt from "bcrypt";



export const usersDto = [
  {"firstName": "Wendy", "lastName": "Anderson", "email": generateRandomEmail(), "password": generateRandomValue()},
  {"firstName": "Julia", "lastName": "Wilkins", "email": generateRandomEmail(), "password": generateRandomValue()},
  {"firstName": "David", "lastName": "Lowe", "email": generateRandomEmail(), "password": generateRandomValue()},
  {"firstName": "Ivan", "lastName": "Mendoza", "email": generateRandomEmail(), "password": generateRandomValue()},
  {"firstName": "Angela", "lastName": "Smith", "email": generateRandomEmail(), "password": generateRandomValue()}
];

export const users = usersDto.map(userDtoToInstance);

export function userDtoToInstance(user: any) {
  return {...user, password: bcrypt.hash(user.password, 10), createdAt: '2000-01-01 00:00:00', updatedAt: '2000-01-01 00:00:00', deletedAt: null }
}
