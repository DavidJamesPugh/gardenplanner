import app from './app.js';// The Express app
import { config } from './utils/config.js';
import { logger } from './utils/logger.js';

app.get('/', (req, res) => {
  res.json({ message: 'Create Gardens Here' });
});
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
