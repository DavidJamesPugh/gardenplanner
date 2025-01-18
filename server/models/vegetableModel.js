import mongoose from 'mongoose';

const dbForVegetable = mongoose.connection.useDb('vegetables');

const vegetableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  firstPlantingDate: Number,
  lastPlantingDate: Number,
  fruitsInDays: Number,
  stopsFruitingInDays: Number,
  sunHoursRequired: Number,
  spacing: Number,
  garden: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garden'
  },
  // User Relation
});


const Vegetable = dbForVegetable.model('Vegetable', vegetableSchema);

export default Vegetable;
