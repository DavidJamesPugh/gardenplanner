import mongoose from 'mongoose';

const usersTable = mongoose.connection.useDb('usersApp');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  gardens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Garden',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // eslint-disable-next-line no-param-reassign,no-underscore-dangle
    returnedObject.id = returnedObject._id.toString();
    // eslint-disable-next-line no-param-reassign,no-underscore-dangle
    delete returnedObject._id;
    // eslint-disable-next-line no-param-reassign,no-underscore-dangle
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    // eslint-disable-next-line no-param-reassign
    delete returnedObject.passwordHash;
  },
});


const User = usersTable.model('User', userSchema);

export default User;
