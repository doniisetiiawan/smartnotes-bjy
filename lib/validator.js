import validator from 'validator';
import { extend } from 'lodash';

const customValidator = extend({}, validator);

customValidator.validate = (method) => {
  if (!customValidator[method]) {
    throw new Error('validator method does not exist');
  }

  // eslint-disable-next-line no-undef
  const args = Array.prototype.slice.call(arguments, 1);

  // eslint-disable-next-line prefer-spread
  return (value) => customValidator[method].apply(
    customValidator,
    Array.prototype.concat(value, args),
  );
};

export default customValidator;
