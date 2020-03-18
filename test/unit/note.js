// eslint-disable-next-line no-unused-vars
import should from 'should';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import mocha from 'mocha';

import {
  getMongooseStub,
  shouldDefineSchemaProperty as shouldDefineSchemaPropertyx,
  shouldRegisterSchema as shouldRegisterSchemax,
  shouldBeRequired as shouldBeRequiredx,
  shouldBeA as shouldBeAx,
  shouldDefaultTo as shouldDefaultTox,
  shouldBeBetween as shouldBeBetweenx,
  shouldValidateThat as shouldValidateThatx,
  shouldLoadPlugin as shouldLoadPluginx,
} from '../utils/helpers';

const { describe, it, before } = mocha;

const mongoose = getMongooseStub();

const shouldDefineSchemaProperty = shouldDefineSchemaPropertyx.bind(
  null,
  mongoose.Schema,
);
const shouldRegisterSchema = shouldRegisterSchemax.bind(
  null,
  mongoose.model,
  mongoose.Schema,
);
const shouldBeRequired = shouldBeRequiredx.bind(
  null,
  mongoose.Schema,
);
const shouldBeA = shouldBeAx.bind(null, mongoose.Schema);
const shouldDefaultTo = shouldDefaultTox.bind(
  null,
  mongoose.Schema,
);
const shouldBeBetween = shouldBeBetweenx.bind(
  null,
  mongoose.Schema,
);
const shouldValidateThat = shouldValidateThatx.bind(
  null,
  mongoose.Schema,
);
const shouldLoadPlugin = shouldLoadPluginx.bind(
  null,
  mongoose.Schema,
);

describe('Note', () => {
  // eslint-disable-next-line no-unused-vars
  let Note;
  let mongooseTimestamp;

  before(() => {
    mongooseTimestamp = sinon.stub();
    Note = proxyquire('../../models/note', {
      'mongoose-timestamp': mongooseTimestamp,
      mongoose,
    });
  });

  it('should register the Mongoose model', () => {
    shouldRegisterSchema('Note');
  });

  it('should load the timestamps plugin', () => {
    shouldLoadPlugin(mongooseTimestamp);
  });

  describe('title', () => {
    it('should be required', () => {
      shouldBeRequired('title');
    });

    it('should be a string', () => {
      shouldBeA('title', String);
    });

    it('should have a length of 3-255 chars', () => {
      shouldValidateThat('title', 'isLength', 3, 255);
    });
  });

  describe('description', () => {
    it('should be required', () => {
      shouldBeRequired('description');
    });

    it('should be a string', () => {
      shouldBeA('description', String);
    });

    it('should have a length of 10-255 chars', () => {
      shouldValidateThat(
        'description',
        'isLength',
        10,
        255,
      );
    });
  });

  describe('userId', () => {
    it('should be required', () => {
      shouldBeRequired('userId');
    });

    it('should be an ObjectId', () => {
      shouldBeA('userId', mongoose.Schema.ObjectId);
    });

    it('should reference the User model', () => {
      shouldDefineSchemaProperty({
        userId: { ref: 'User' },
      });
    });
  });

  describe('rating', () => {
    it('should be a number', () => {
      shouldBeA('rating', Number);
    });

    it('should default to 0 (unrated)', () => {
      shouldDefaultTo('rating', 0);
    });

    it('should be between 0 and 10', () => {
      shouldBeBetween('rating', { min: 0, max: 10 });
    });
  });

  describe('category', () => {
    it('should be a string', () => {
      shouldBeA('category', String);
    });

    it('should default to general', () => {
      shouldDefaultTo('category', 'general');
    });
  });

  describe('public', () => {
    it('should be a boolean', () => {
      shouldBeA('public', Boolean);
    });

    it('should default to false', () => {
      shouldDefaultTo('public', false);
    });
  });
});
