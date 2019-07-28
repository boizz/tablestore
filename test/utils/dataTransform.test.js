const assert = require('power-assert');

const { TRANSFORM_RETURN } = require('../../lib/utils/dataTransform');
const { compare } = require('../__utils__/data');
const { RETURN } = require('../__data__/utils');


describe('数据处理', () => {
  it('输出数据转换', () => {
    assert(compare(RETURN.target.data, TRANSFORM_RETURN(RETURN.simple).data));
  });
});
