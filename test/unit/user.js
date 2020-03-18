// eslint-disable-next-line no-unused-vars
import should from 'should';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import mocha from 'mocha';

import {
  getMongooseStub as getMongooseStubx,
  shouldRegisterSchema as shouldRegisterSchemax,
  shouldBeRequired as shouldBeRequiredx,
  shouldBeUnique as shouldBeUniquex,
  shouldBeA as shouldBeAx,
  shouldValidateThat as shouldValidateThatx,
  shouldValidateMany as shouldValidateManyx,
  shouldLoadPlugin as shouldLoadPluginx,
} from '../utils/helpers';

const { describe, it, before } = mocha;

const mongoose = getMongooseStubx();

const shouldRegisterSchema = shouldRegisterSchemax.bind(
  null,
  mongoose.model,
  mongoose.Schema,
);
const shouldBeRequired = shouldBeRequiredx.bind(
  null,
  mongoose.Schema,
);
const shouldBeUnique = shouldBeUniquex.bind(
  null,
  mongoose.Schema,
);
const shouldBeA = shouldBeAx.bind(null, mongoose.Schema);
const shouldValidateThat = shouldValidateThatx.bind(
  null,
  mongoose.Schema,
);
const shouldValidateMany = shouldValidateManyx.bind(
  null,
  mongoose.Schema,
);
const shouldLoadPlugin = shouldLoadPluginx.bind(
  null,
  mongoose.Schema,
);

describe('User', () => {
  // eslint-disable-next-line no-unused-vars
  let User;
  let mongoosePassport;

  before(() => {
    mongoosePassport = sinon.stub();
    User = proxyquire('../../models/user', {
      'passport-local-mongoose': mongoosePassport,
      mongoose,
    });
  });

  it('should register the Mongoose model', () => {
    shouldRegisterSchema('User');
  });

  it('should load the passport plugin', () => {
    shouldLoadPlugin(mongoosePassport);
  });

  describe('username', () => {
    it('should be required', () => {
      shouldBeRequired('username');
    });

    it('should be a string', () => {
      shouldBeA('username', String);
    });

    it('should be unique', () => {
      shouldBeUnique('username');
    });

    it('should be alphanumeric and have 4-255 chars', () => {
      shouldValidateMany(
        'username',
        {
          args: ['isAlphanumeric'],
          msg: 'username must be alphanumeric',
        },
        {
          args: ['isLength', 4, 255],
          msg: 'username must have 4-255 chars',
        },
      );
    });
  });

  describe('email', () => {
    it('should be required', () => {
      shouldBeRequired('email', String);
    });

    it('should be a string', () => {
      shouldBeA('email', String);
    });

    it('should be unique', () => {
      shouldBeUnique('email');
    });

    it('should be a valid email', () => {
      shouldValidateThat('email', 'isEmail');
    });
  });

  describe('name', () => {
    it('should be a string', () => {
      shouldBeA('name', String);
    });
  });
});
