/* eslint-disable no-unused-expressions */
import mocha from 'mocha';
// eslint-disable-next-line no-unused-vars
import should from 'should';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

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

    it('should be memoized', () => {
      const noop = sinon.stub();
      const memoize = sinon.spy(() => noop);
      const validator = proxyquire('../../lib/validator', {
        memoizejs: memoize,
      });

      should(memoize.calledOnce).be.true();
      should(validator.validate).equal(noop());
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
