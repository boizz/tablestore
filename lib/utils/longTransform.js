const { Long } = require('tablestore');

function SIMPLE2LONG(value) {
  if (typeof value === 'number' && value % 1 === 0) {
    return Long.fromNumber(value);
  }
  return value;
}

function LONG2SIMPLE(value) {
  if (typeof value === 'object' && Object.getPrototypeOf(value).constructor.name === 'Int64') {
    return value.toNumber();
  }
  return value;
}

exports.SIMPLE2LONG = SIMPLE2LONG;
exports.LONG2SIMPLE = LONG2SIMPLE;
