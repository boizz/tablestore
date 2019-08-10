const assert = require('power-assert');

const { TRANSFORM_RETURN } = require('../../lib/utils/dataTransform');
const { compare } = require('../__utils__/data');
const { RETURN_SINGLE, RETURN_MULTIPLE, RETURN_TABLES } = require('../__data__/utils');


describe('数据处理', () => {
  it('单行数据输出', () => {
    assert(compare(RETURN_SINGLE.target.data, TRANSFORM_RETURN(RETURN_SINGLE.simple).data));
  });
  it('多行数据输出', () => {
    assert(compare(RETURN_MULTIPLE.target.data, TRANSFORM_RETURN(RETURN_MULTIPLE.simple).data));
  });
  it('多表数据输出', () => {
    assert(compare(RETURN_TABLES.target.data, TRANSFORM_RETURN(RETURN_TABLES.simple).data));
  });
});
