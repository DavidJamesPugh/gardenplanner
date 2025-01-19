import bcrypt from 'bcrypt';
import express from 'express';
import User from '../models/userModel.js';

const usersRouter = express.Router();

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('gardens', { name: 1, length: 1, width: 1 });
  response.json(users);
});

export default usersRouter;
