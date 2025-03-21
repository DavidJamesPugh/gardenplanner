import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express from 'express';
import User from '../models/userModel.js';

const loginRouter = express.Router();


loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'Invalid Credentials',
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 },
  );

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

loginRouter.post('/createaccount', async (request, response) => {
  const { username, name, password } = request.body;

  const saltRound = 10;
  const passwordHash = await bcrypt.hash(password, saltRound);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});


export default loginRouter;
