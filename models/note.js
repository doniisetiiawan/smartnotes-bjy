import timestamps from 'mongoose-timestamp';
import mongoose from 'mongoose';
import validator from '../lib/validator';

const { Schema } = mongoose;
const { ObjectId } = Schema;

const Note = new Schema({
  title: {
    type: String,
    required: true,
    validate: validator.validate('isLength', 3, 255),
  },
  description: {
    type: String,
    required: true,
    validate: validator.validate('isLength', 10, 255),
  },
  userId: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  category: {
    type: String,
    default: 'general',
  },
  public: {
    type: Boolean,
    default: false,
  },
});

Note.plugin(timestamps);

export default mongoose.model('Note', Note);
