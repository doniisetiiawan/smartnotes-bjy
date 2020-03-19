import _ from 'lodash';
// import convert from 'xml-js';
import { isValidationError } from '../lib/db';

export function index(req, res, next) {
  req.Note.find({ userId: req.user._id }, (err, notes) => {
    if (err) {
      return next(err);
    }

    res.send(notes);
  });
}

export function show(req, res, next) {
  req.Note.findOne(
    { _id: req.params.id, userId: req.user._id },
    (err, note) => {
      if (err) {
        return next(err);
      }

      res.send(note);
      // res.cachable(note);
      // switch (req.params.format) {
      //   case 'json':
      //     res.send(note);
      //     break;
      //   case 'xml':
      //     res.set('Content-Type', 'application/xml');
      //     res.end(convert.json2xml(note));
      //     break;
      //   default:
      //     res.status(400).send({ error: 'unknown format' });
      // }
    },
  );
}

export function create(req, res, next) {
  const note = new req.Note(
    _.pick(req.body, [
      'title',
      'description',
      'rating',
      'category',
      'public',
    ]),
  );
  note.userId = req.user._id;

  note.save((err, noteData) => {
    if (err) {
      if (isValidationError(err)) {
        res.status(422).send({ errors: ['invalid data'] });
      } else {
        next(err);
      }
    } else {
      res
        .status(201)
        .set('Location', `/notes/${noteData._id}`)
        .send(noteData);
    }
  });
}

export function showPublic(req, res, next) {
  req.User.findOne(
    { username: req.params.username },
    (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res
          .status(404)
          .send({ errors: ['no such user'] });
      }

      req.Note.find(
        { userId: user._id, public: true },
        (err, notes) => {
          if (err) {
            return next(err);
          }

          res.send(notes);
        },
      );
    },
  );
}
