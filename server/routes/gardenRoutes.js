import express from 'express';

const gardenRouter = express.Router();

gardenRouter.get('/', (req, res) => {
  res.json({ message: 'Retrieve garden data here' });
});

gardenRouter.post('/', (req, res) => {
  res.json({ message: 'Save garden data here' });
});

export default gardenRouter;
