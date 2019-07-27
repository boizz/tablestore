const proxyquire = require('proxyquire');
const assert = require('power-assert');

const mockTableStore = require('../__mock__/tablestore');
const { compare } = require('../__utils__/data');
const {
  GET,
  PUT,
  UPDATE,
  DELETE,
} = require('../__data__/row');

const { RowExistenceExpectation, ReturnType } = require('../../index');

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

describe('Row', () => {
  const tj = new TJ(config, tables, indexes);

  it('Put', () => {
    const res = tj.row('sampleTable')
      .rowExistenceExpectation(RowExistenceExpectation.IGNORE)
      .returnType(ReturnType.Primarykey)
      .put({
        gid: 20013,
        uid: 20013,
        col1: '表格存储',
        col2: '2',
        col3: 3.1,
        col4: -0.32,
        col5: 123456789,
      });
    assert(compare(PUT, res.params));
  });

  it('Get', async () => {
    const res = await tj.row('sampleTable')
      .maxVersions(2)
      .primaryKey({
        gid: 20004,
        uid: 20004,
      })
      .get();
    assert(compare(GET, res.params));
  });

  it('Update', () => {
    const res = tj.row('sampleTable')
      .primaryKey({
        gid: 9,
        uid: 90,
      })
      .rowExistenceExpectation(RowExistenceExpectation.IGNORE)
      .update({
        PUT: {
          col4: 4,
          col5: '5',
          col6: 6,
        },
        DELETE: {
          col1: 1496826473186,
        },
        DELETE_ALL: ['col2'],
      });
    assert(compare(UPDATE, res.params));
  });

  it('Delete', () => {
    const res = tj.row('sampleTable')
      .rowExistenceExpectation(RowExistenceExpectation.IGNORE)
      .primaryKey({
        gid: 8,
        uid: 80,
      })
      .delete;
    assert(compare(DELETE, res.params));
  });
});
