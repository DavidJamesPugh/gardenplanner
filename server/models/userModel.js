import mongoose from 'mongoose';

const usersTable = mongoose.connection.useDb('usersApp');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  passwordHash: String,
  gardens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Garden',
    },
  ],
});

const User = usersTable.model('User', userSchema);

export default User;
