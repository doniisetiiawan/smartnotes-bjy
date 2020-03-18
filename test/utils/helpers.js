/* eslint-disable prefer-spread */
import sinon from 'sinon';
// eslint-disable-next-line no-unused-vars
import should from 'should';
import validator from '../../lib/validator';

export function getMongooseStub() {
  const mongoose = {};

  mongoose.Schema = sinon.stub();
  mongoose.Schema.ObjectId = 'ObjectId';
  mongoose.Schema.prototype.plugin = sinon.stub();
  mongoose.model = sinon.stub();

  return mongoose;
}

export function shouldDefineSchemaProperty(
  Schema,
  property,
) {
  sinon.assert.called(
    Schema.withArgs(sinon.match(property)),
  );
}

export function shouldBeRequired(Schema, property) {
  const obj = {};
  obj[property] = {
    required: true,
  };
  exports.shouldDefineSchemaProperty(Schema, obj);
}

export function shouldBeUnique(Schema, property) {
  const obj = {};
  obj[property] = {
    unique: true,
  };
  exports.shouldDefineSchemaProperty(Schema, obj);
}

export function shouldBeA(Schema, property, type) {
  const obj = {};
  obj[property] = {
    type,
  };
  exports.shouldDefineSchemaProperty(Schema, obj);
}

export function shouldDefaultTo(
  Schema,
  property,
  defaultValue,
) {
  const obj = {};
  obj[property] = {
    default: defaultValue,
  };
  exports.shouldDefineSchemaProperty(Schema, obj);
}

export function shouldBeBetween(Schema, property, opts) {
  const obj = {};
  obj[property] = {
    min: opts.min,
    max: opts.max,
  };
  exports.shouldDefineSchemaProperty(Schema, obj);
}

export function shouldValidateThat(Schema, property) {
  // eslint-disable-next-line prefer-rest-params
  const args = Array.prototype.slice.call(arguments, 2);
  const obj = {};
  obj[property] = {
    validate: validator.validate.apply(validator, args),
  };
  exports.shouldDefineSchemaProperty(Schema, obj);
}

export function shouldValidateMany(
  Schema,
  property,
  validation1,
  validation2,
) {
  const obj = {};
  obj[property] = {
    validate: [
      {
        validator: validator.validate.apply(
          validator,
          validation1.args,
        ),
        msg: validation1.msg,
      },
      {
        validator: validator.validate.apply(
          validator,
          validation2.args,
        ),
        msg: validation2.msg,
      },
    ],
  };
  exports.shouldDefineSchemaProperty(Schema, obj);
}

export function shouldRegisterSchema(Model, Schema, name) {
  Model.calledWith(name).should.be.true();
  Model.args[0][1].should.be.an.instanceOf(Schema);
}

export function shouldLoadPlugin(Schema, plugin) {
  sinon.assert.called(
    Schema.prototype.plugin.withArgs(plugin),
  );
}
