const proxyquire = require('proxyquire');
const assert = require('power-assert');

const mockTableStore = require('../__mock__/tablestore');
const { compare } = require('../__utils__/data');
const { GET_ROW, WHITE_ROW, GET_RANGE } = require('../__data__/batch');

// const { TJ, RowExistenceExpectation, ReturnType } = require('../../index');
const TJ = proxyquire('../../lib/core', {
  tablestore: mockTableStore,
});

const config = {
  accessKeyId: 'xxx',
  secretAccessKey: 'xxxx',
  endpoint: 'https://penelop-test.cn-shenzhen.ots.aliyuncs.com',
  instancename: 'penelop-test',
};

const tables = [
  {
    tableName: 'sampleTable',
    primaryKey: [
      {
        name: 'gid',
        type: 'INTEGER',
      },
      {
        name: 'uid',
        type: 'INTEGER',
      },
    ],
  },
  {
    tableName: 'notExistTable',
    primaryKey: [
      {
        name: 'gid',
        type: 'INTEGER',
      },
      {
        name: 'uid',
        type: 'INTEGER',
      },
    ],
  },
];

const indexes = [];

describe('Batch', () => {
  const tj = new TJ(config, tables, indexes);

  it('Batch get row', async () => {
    const res = await tj.batch.getRow(GET_ROW.target);
    assert(compare(GET_ROW.sample, res.params));
  });

  it('Batch white row', () => {
    const res = tj.batch.writeRow(WHITE_ROW.target);
    assert(compare(WHITE_ROW.sample, res.params));
  });

  it('Get range', async () => {
    const res = await tj.batch.getRange(GET_RANGE.target);
    assert(compare(GET_RANGE.sample, res.params));
  });
});
