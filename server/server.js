import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import gardenRouter from './routes/gardenRoutes.js';
import loginRouter from './routes/loginRoutes.js';
import usersRouter from './routes/userRoutes.js';
import { config } from './utils/config.js';
import logger from './utils/logger.js';
import mongoose from 'mongoose';
import { middleware } from './utils/middleware.js';

dotenv.config({ path: './.env' });

const app = express();
const port = config.PORT || 5001;
mongoose.set('strictQuery', false);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use('/api/garden', gardenRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);


app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);


export default app;
