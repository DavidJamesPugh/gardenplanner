import express from 'express';
import cors from 'cors';
import vegeRouter from './routes/vegetableRoutes.js';
import { middleware } from './utils/middleware.js';
import { config } from './utils/config.js';
import logger from './utils/logger.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);

(async() => {
  try {
    const db = await middleware.initializeDatabase();
    app.locals.db = db; // Store DB globally

    // Middleware to attach DB to every request
    app.use((req, res, next) => {
      req.db = app.locals.db;
      next();
    });

    // Routes
    app.use('/api/vegetables', vegeRouter);
    app.use(middleware.unknownEndpoint);

    logger.info('✅ Database initialized.');

    // ✅ **Start the server here**
    app.listen(config.PORT, () => {
      logger.info(`🚀 Server running on port ${config.PORT}`);
    });
  }
  catch (error) {
    logger.error('❌ Error initializing database:', error);
    process.exit(1);
  }
})();

logger.info(`🔵 Server setup complete, but not yet listening...`);
