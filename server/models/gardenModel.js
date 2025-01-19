import mongoose from 'mongoose';

const dbForGarden = mongoose.connection.useDb('gardens');

const gardenSchema = new mongoose.Schema({
  width: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true
  },
  sunHours: Number,
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});


const Garden = dbForGarden.model('Garden', gardenSchema);

export default Garden;
