import express from 'express';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
// import redis from 'redis';
// import crypto from 'crypto';

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
// import limiter from './lib/rate-limiter';

import configx from './config.json';

const app = express();
const config = configx[app.get('env')];

connect(config.mongoUrl);

// const db = redis.createClient();
// 5000 requests, duration 1 day
// const limiterx = limiter(
//   connect(config.mongoUrl),
//   5000,
//   60 * 60 * 24,
// );

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

// const cacheAndServe = (req, res, next) => {
//   res.cachable = (content) => {
//     const stringContent = JSON.stringify(content);
//
//     const hash = crypto.createHash('md5');
//     hash.update(stringContent);
//     res.set({ ETag: hash.digest('hex') });
//     if (req.fresh) {
//       // remove content headers
//       if (res._headers) {
//         Object.keys(res._headers).forEach((header) => {
//           if (header.indexOf('content') === 0) {
//             res.removeHeader(header);
//           }
//         });
//       }
//       res.statusCode = 304;
//       return res.end();
//     }
//     res.setHeader('Content-Type', 'application/json');
//     res.end(stringContent);
//   };
//   next();
// };

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
// app.get('/notes/:id', usersAuthenticate, cacheAndServe, notesshow);
// app.get('/notes/:id', limiterx, usersAuthenticate, notesshow);

app.listen(config.port);
console.log(
  '(%s) app listening on port %s',
  app.get('env'),
  config.port,
);

export default app;
