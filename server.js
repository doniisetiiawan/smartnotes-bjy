import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

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

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(config.port, () => console.log(
  `Example app listening on port ${config.port}!`,
));
