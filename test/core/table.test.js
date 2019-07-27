const proxyquire = require('proxyquire');
const assert = require('power-assert');

const mockTableStore = require('../__mock__/tablestore');
const { compare } = require('../__utils__/data');
const {
  CREATE,
  UPDATE,
  DESCRIBE,
  DELETE,
} = require('../__data__/table');

// const { TJ } = require('../../index');

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

describe('Table', () => {
  const tj = new TJ(config, tables, indexes);

  it('Create', () => {
    const res = tj.table('sampleTable')
      .capacityUnit({
        read: 0,
        write: 0,
      })
      .tableOptions({
        timeToLive: -1,
        maxVersions: 1,
      })
      .create;
    assert(compare(CREATE, res.params));
  });

  it('Update', () => {
    const res = tj.table('sampleTable')
      .tableOptions({
        maxVersions: 5,
      })
      .update;
    assert(compare(UPDATE, res.params));
  });

  it('Describe', () => {
    const res = tj.table('sampleTable').describe;
    assert(compare(DESCRIBE, res.params));
  });

  it('List', () => {
    const res = tj.table().list;
    assert(compare({}, res.params));
  });

  it('Delete', () => {
    const res = tj.table('sampleTable').delete;
    assert(compare(DELETE, res.params) && tables.length === 1);
  });
});
