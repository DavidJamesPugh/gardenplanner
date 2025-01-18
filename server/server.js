import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import gardenRouter from './routes/gardenRoutes.js';

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/api/garden', gardenRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Create Gardens Here' });
});
// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
