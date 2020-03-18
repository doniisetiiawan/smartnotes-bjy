import async from 'async';
import mongoose from 'mongoose';
import config from '../../config.json';
import { connect as connectx } from '../../lib/db';
import Note from '../../models/note';
import User from '../../models/user';
import userFixtures from '../fixtures/users.json';
import notesFixtures from '../fixtures/notes.json';

export function connect(callback) {
  connectx(config.test.mongoUrl, callback);
}

// empty the database
export function reset(callback) {
  async.parallel(
    [
      function emptyNotesCollection(cb) {
        Note.deleteMany({}, cb);
      },
      function emptyUsersCollection(cb) {
        User.deleteMany({}, cb);
      },
    ],
    callback,
  );
}

// populate the database with fixtures
export function populate(callback) {
  async.each(
    userFixtures,
    (data, next) => {
      User.register(
        new User({
          username: data.username,
          email: data.email,
          name: data.name,
        }),
        data.password,
        next,
      );
    },
    (err) => {
      if (err) {
        return callback(err);
      }

      User.findOne({ username: 'johndoe' }, (err, user) => {
        if (err) {
          return callback(err);
        }

        async.each(
          notesFixtures,
          (data, next) => {
            const note = new Note(data);
            note.userId = user._id;
            note.save(next);
          },
          callback,
        );
      });
    },
  );
}

// connect to, reset and populate database with fixtures
export function setupDatabase(callback) {
  const resetAndPopulate = (err) => {
    if (err) {
      return callback(err);
    }

    exports.reset((err) => {
      if (err) {
        return callback(err);
      }

      exports.populate(callback);
    });
  };

  if (mongoose.connection.db) {
    return resetAndPopulate();
  }
  exports.connect();
}
