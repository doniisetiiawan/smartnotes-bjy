import mongoose from 'mongoose';

export function isValidationError(err) {
  return err && err.message && /ValidationError/.test(err.message);
}

export function isDuplicateKeyError(err) {
  return err && err.message && /duplicate key/.test(err.message);
}

export function connect(
  url,
  cb = (err) => {
    if (err) {
      console.error(`database connection failure: \n${err.stack}`);
      process.exit(1);
    }
  },
) {
  mongoose.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    cb,
  );
}
