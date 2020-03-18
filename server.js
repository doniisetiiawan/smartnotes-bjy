import express from 'express';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';

import User from './models/user';
import Note from './models/note';
import {
  show as usersShow,
  create as usersCreate,
  authenticate as usersAuthenticate,
  update as usersUpdate,
} from './routes/users';
import {
  showPublic as notesshowPublic,
  index as notesindex,
  create as notescreate,
  show as notesshow,
} from './routes/notes';

import { connect } from './lib/db';

const app = express();

const config = require('./config.json')[app.get('env')];

connect(config.mongoUrl);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  methodOverride((req, res) => {
    if (
      req.body
      && typeof req.body === 'object'
      && '_method' in req.body
    ) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  }),
);

app.use((req, res, next) => {
  req.User = User;
  req.Note = Note;
  next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/users/:username', usersShow);
app.post('/users', usersCreate);
app.get('/users/:username/notes', notesshowPublic);
app.patch(
  '/users/:username',
  usersAuthenticate,
  usersUpdate,
);
app.get('/notes', usersAuthenticate, notesindex);
app.post('/notes', usersAuthenticate, notescreate);
app.get('/notes/:id', usersAuthenticate, notesshow);

app.listen(config.port);
console.log('(%s) app listening on port %s', app.get('env'), config.port);

export default app;
