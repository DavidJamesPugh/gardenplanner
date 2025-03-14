import logger from './logger.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
sqlite3.verbose();

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// eslint-disable-next-line consistent-return
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).send({ error: 'Duplicate username exists in table' });
  } if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' });
  } if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired', });
  }

  next(error);
};

const initializeDatabase = async() => {
  const db = await open({
    filename: './data/database.db', // SQLite database file
    driver: sqlite3.Database,
  });
  await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )
`);

  // Create tables if they don’t exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS vegetables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      firstPlantingDate INTEGER,
      lastPlantingDate INTEGER,
      fruitsInDays INTEGER,
      stopsFruitingInDays INTEGER,
      sunHoursRequired INTEGER,
      spacingCM INTEGER,
      gardenId GUID,
      FOREIGN KEY (gardenId) REFERENCES gardens(id)
    )
  `);

  return db;
};

const middleware = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  initializeDatabase,
};

export { middleware };
