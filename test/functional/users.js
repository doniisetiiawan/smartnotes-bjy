import request from 'supertest';
// eslint-disable-next-line no-unused-vars
import should from 'should';
import mocha from 'mocha';

import app from '../../server';
import { setupDatabase, reset } from '../utils/db';
import userx from '../fixtures/users.json';

const user = userx[0];

const {
  describe, it, before, after,
} = mocha;

describe('User-Routes', () => {
  before((done) => {
    setupDatabase(done);
  });

  after((done) => {
    reset(done);
  });

  it('should return the user details', (done) => {
    request(app)
      .get(`/users/${user.username}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        res.body.should.have.properties(
          'username',
          'email',
          'name',
        );

        done();
      });
  });

  it('should create a new user', (done) => {
    request(app)
      .post('/users')
      .send({
        username: 'newuser',
        password: 'newuser_password',
        email: 'newuser@example.com',
        name: 'doe',
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect('Location', '/users/newuser')
      .expect(
        {
          username: 'newuser',
          email: 'newuser@example.com',
          name: 'doe',
        },
        done,
      );
  });

  it('should update the current user', (done) => {
    request(app)
      .patch(`/users/${user.username}`)
      .set(
        'Authorization',
        `Basic ${Buffer.from(
          `${user.username}:${user.password}`,
        ).toString('base64')}`,
      )
      .send([
        {
          op: 'replace',
          path: '/email',
          value: 'johndoe_the_third@example.com',
        },
        {
          op: 'replace',
          path: '/name',
          value: 'John Doe The Third',
        },
      ])
      .expect(204, done);
  });
});
