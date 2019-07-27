function NESTED2STRING(value) {
  if (typeof value === 'object') {
    const protoName = Object.getPrototypeOf(value).constructor.name;
    if (protoName === 'Object' || protoName === 'Array') {
      try {
        return JSON.stringify(value);
      } catch (e) {
        console.warn(e);
      }
    }
  }
  return value;
}

function STRING2NESTED(value) {
  if (typeof value === 'string' && /(^\[.*\]$)|(^\{.*\}$)/.test(value)) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn(e);
    }
  }
  return value;
}

exports.NESTED2STRING = NESTED2STRING;
exports.STRING2NESTED = STRING2NESTED;
