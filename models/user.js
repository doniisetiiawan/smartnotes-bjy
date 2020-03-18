import passportLocalMongoose from 'passport-local-mongoose';
import mongoose from 'mongoose';
import validator from '../lib/validator';

const { Schema } = mongoose;

const User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: [
      {
        validator: validator.validate('isAlphanumeric'),
        msg: 'username must be alphanumeric',
      },
      {
        validator: validator.validate('isLength', 4, 255),
        msg: 'username must have 4-255 chars',
      },
    ],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.validate('isEmail'),
  },
  name: {
    type: String,
  },
});

User.plugin(passportLocalMongoose);

export default mongoose.model('User', User);
