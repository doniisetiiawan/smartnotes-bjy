/* eslint-disable no-unused-expressions */
import mocha from 'mocha';
// eslint-disable-next-line no-unused-vars
import should from 'should';
import sinon from 'sinon';

import validator from '../../lib/validator';

const { describe, it } = mocha;

describe('validator', () => {
  describe('validate', () => {
    it("should throw an error if the delegated method doesn't exist", () => {
      delete validator.unknownMethod;
      (() => {
        validator.validate('unknownMethod');
      }).should.throw(/validator method does not exist/i);
    });

    it('should return a function', () => {
      validator.noop = () => {};
      should(validator.validate('noop')).be.a.Function;
    });

    describe('inner function', () => {
      it('should call the delegated method with the arguments in order', () => {
        const method = sinon.spy();

        validator.myCustomValidationMethod = method;
        validator.validate(
          'myCustomValidationMethod',
          1,
          2,
          3,
        )('str');

        method.calledWith('str', 1, 2, 3).should.be.true;
      });
    });
  });
});
