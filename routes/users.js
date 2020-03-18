import _ from 'lodash';
import basicAuth from 'basic-auth-connect';
import {
  isValidationError,
  isDuplicateKeyError,
} from '../lib/db';

const publicAttributes = ['username', 'email', 'name'];

export function show(req, res, next) {
  req.User.findOne(
    { username: req.params.username },
    (err, userData) => {
      if (err) {
        return next(err);
      }

      if (!userData) {
        return res
          .status(404)
          .send({ errors: ['user not found'] });
      }

      res.send(_.pick(userData, publicAttributes));
    },
  );
}

export function create(req, res, next) {
  const newUser = new req.User(
    _.pick(req.body, publicAttributes),
  );

  req.User.register(
    newUser,
    req.body.password,
    (err, userData) => {
      if (err) {
        if (isValidationError(err)) {
          res
            .status(422)
            .send({ errors: ['invalid data'] });
        } else if (isDuplicateKeyError(err)) {
          res.status(422).send({
            errors: ['username/email already exists'],
          });
        } else {
          next(err);
        }
      } else {
        res
          .status(201)
          .set('Location', `/users/${userData.username}`)
          .send(_.pick(userData, publicAttributes));
      }
    },
  );
}

// using the JSON Patch protocol http://tools.ietf.org/html/rfc6902
export function update(req, res, next) {
  function saveAndRespond(user) {
    user.save((err, userData) => {
      if (err) {
        if (isValidationError(err)) {
          res
            .status(422)
            .send({ errors: ['invalid data'] });
        } else if (isDuplicateKeyError) {
          res
            .status(422)
            .send({ errors: ['email already exists'] });
        } else {
          next(err);
        }
      } else {
        res
          .status(204)
          .send(_.pick(userData, publicAttributes));
      }
    });
  }

  if (req.params.username !== req.user.username) {
    return res
      .status(403)
      .send({ errors: ['cannot update other users'] });
  }
  if (!Array.isArray(req.body)) {
    return res
      .status(400)
      .send({ errors: ['use JSON Patch'] });
  }
  if (req.body.some((item) => item.op !== 'replace')) {
    return res
      .status(422)
      .send({ errors: ['only replace is supported atm'] });
  }
  req.User.findOne(
    { username: req.user.username },
    (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res
          .status(404)
          .send({ errors: ['no such user'] });
      }

      req.body.forEach((item) => {
        // shouldn't be able to change username
        if (item.path !== '/username') {
          user[item.path.replace(/^\//, '')] = item.value;
        }
      });

      // handling special password case
      if (user.password) {
        const { password } = user;
        delete user.password;

        // function from passport-local-mongoose
        user.setPassword(password, (err) => {
          if (err) {
            return next(err);
          }

          saveAndRespond(user);
        });
      } else {
        saveAndRespond(user);
      }
    },
  );
}

// automatically sets req.user if found
export function authenticate(req, res, next) {
  basicAuth((user, pass, fn) => {
    // function from passport-local-mongoose
    req.User.authenticate()(user, pass, (err, userData) => {
      // no need to store salt and hash
      fn(
        err,
        _.pick(userData, [
          '_id',
          'username',
          'email',
          'name',
        ]),
      );
    });
  })(req, res, next);
}
