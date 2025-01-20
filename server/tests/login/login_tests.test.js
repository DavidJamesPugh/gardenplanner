import {
  test, after, beforeEach, describe,
} from 'node:test';
import mongoose from 'mongoose';
import supertest from 'supertest';
import assert from 'assert';
import bcrypt from 'bcrypt';
import app from '../../server.js';
import User from '../../models/userModel.js';
import { LoginHelper } from './login_helper.js';
import jwt from 'jsonwebtoken';

mongoose.set('strictQuery', false); // Ensure Mongoose handles queries correctly

const api = supertest(app);

describe('UserLogging in', () => {
beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({
    username: 'root',name:'Admin', passwordHash,
  });

  await user.save();

});
test('Creating account', async () => {
  const usersAtStart = await LoginHelper.usersInDB();
  const newUser = {
    username: 'BMO',
    name: 'BMO',
    password: 'StrongPass',
  };
  await api
    .post('/api/login/createaccount')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const usersAtEnd = await LoginHelper.usersInDB();
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

  const usernames = usersAtEnd.map((u) => u.username);
  assert(usernames.includes(newUser.username));
});

test('Logging in', async () => {
  const loginCredentials = {
    username: 'root',
    password: 'sekret'
  }

  const token = await api
    .post('/api/login')
    .send(loginCredentials)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const decodedToken = jwt.verify(token.body.token, process.env.SECRET);
  assert(decodedToken.id);

  const user = await User.findById(decodedToken.id);

  assert.strictEqual(user.username,'root');
});
});
after(async () => {
  await mongoose.connection.close();
});
