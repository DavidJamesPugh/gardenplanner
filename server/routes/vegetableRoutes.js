import express from 'express';
import {
  addVegetable,
  getAllVegetables,
  getVegetableById,
  updateVegetable,
  deleteVegetable
} from '../controllers/vegetableController.js';

const vegeRouter = express.Router();

// Middleware to ensure database is available
vegeRouter.use((req, res, next) => {
  if (!req.db) {
    return res.status(500).json({ error: 'Database not initialized' });
  }
  next();
});

vegeRouter.get('/', async(req, res, next) => {
  try {
    console.log("Running");
    const vegetables = await getAllVegetables(req.db);
    res.json(vegetables);
  }
  catch (error) {
    next(error);
  }
});

// Get vegetable by ID
vegeRouter.get('/:id', async(req, res, next) => {
  try {
    const vegetable = await getVegetableById(req.db, req.params.id);
    if (!vegetable) {
      return res.status(404).json({ error: 'Vegetable not found' });
    }
    res.json(vegetable);
  }
  catch (error) {
    next(error);
  }
});

// Add a new vegetable
vegeRouter.post('/', async(req, res, next) => {
  try {
    const newVegetable = await addVegetable(req.db, req.body);
    res.status(201).json(newVegetable);
  }
  catch (error) {
    next(error);
  }
});

// Update a vegetable
vegeRouter.put('/:id', async(req, res, next) => {
  try {
    const updatedVegetable = await updateVegetable(req.db, req.params.id, req.body);
    res.json(updatedVegetable);
  }
  catch (error) {
    next(error);
  }
});

// Delete a vegetable
vegeRouter.delete('/:id', async(req, res, next) => {
  try {
    const result = await deleteVegetable(req.db, req.params.id);
    res.json(result);
  }
  catch (error) {
    next(error);
  }
});

export default vegeRouter;
