import request from 'supertest';
// eslint-disable-next-line no-unused-vars
import should from 'should';
import mocha from 'mocha';

import app from '../../server';
import { setupDatabase, reset } from '../utils/db';

const user = require('../fixtures/users.json')[0];
const note = require('../fixtures/notes.json')[0];

const {
  describe, it, before, after,
} = mocha;

describe('Notes-Routes', () => {
  before((done) => {
    setupDatabase(done);
  });

  after((done) => {
    reset(done);
  });

  it("should return the user's notes", (done) => {
    request(app)
      .get('/notes')
      .set(
        'Authorization',
        `Basic ${Buffer.from(
          `${user.username}:${user.password}`,
        ).toString('base64')}`,
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        res.body.should.be.an.Array();

        done();
      });
  });

  it('should retrieve a particular note', (done) => {
    request(app)
      .get(`/notes/${note._id}`)
      .set(
        'Authorization',
        `Basic ${Buffer.from(
          `${user.username}:${user.password}`,
        ).toString('base64')}`,
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        res.body.should.have.properties(
          'createdAt',
          'updatedAt',
          '_id',
          'userId',
          'title',
          'description',
        );

        done();
      });
  });

  it('should create a note', (done) => {
    request(app)
      .post('/notes')
      .set(
        'Authorization',
        `Basic ${Buffer.from(
          `${user.username}:${user.password}`,
        ).toString('base64')}`,
      )
      .send({
        title: 'my random note',
        description: 'random description here',
      })
      .expect(201)
      .expect('Location', /\/notes\/[0-9a-f]{24}/)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        res.body.should.have.properties(
          'createdAt',
          'updatedAt',
          '_id',
          'userId',
          'title',
          'description',
        );

        done();
      });
  });

  it("should return the user's public notes", (done) => {
    request(app)
      .get(`/users/${user.username}/notes`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        res.body.should.be.an.Array();
        res.body.forEach((note) => {
          note.public.should.be.true();
        });

        done();
      });
  });
});
