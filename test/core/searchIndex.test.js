const proxyquire = require('proxyquire');
const assert = require('power-assert');

const mockTableStore = require('../__mock__/tablestore');
const { compare } = require('../__utils__/data');
const {
  LIST,
  CREATE,
  DESCRIBE,
  DELETE,
} = require('../__data__/searchIndex');

const { SortOrder, FieldType } = require('../../index');

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

const indexes = [{
  tableName: 'sampleTable',
  indexName: 'sampleIndex',
  schema: {
    fieldSchemas: [
      {
        fieldName: 'Col_Keyword',
        fieldType: FieldType.KEYWORD,
        index: true,
        enableSortAndAgg: true,
        store: false,
        isAnArray: false,
      },
      {
        fieldName: 'Col_Long',
        fieldType: FieldType.LONG,
        index: true,
        enableSortAndAgg: true,
        store: true,
        isAnArray: false,
      },
      {
        fieldName: 'Col_Text',
        fieldType: FieldType.TEXT,
        index: true,
        enableSortAndAgg: false,
        store: true,
        isAnArray: false,
      },
    ],
    indexSetting: {
      routingFields: ['Pk_Keyword'],
      routingPartitionSize: null,
    },
    indexSort: {
      sorters: [
        {
          primaryKeySort: {
            order: SortOrder.ASC,
          },
        },
        {
          fieldSort: {
            fieldName: 'Col_Keyword',
            order: SortOrder.DESC,
          },
        },
      ],
    },
  },
}];

describe('Index', () => {
  const tj = new TJ(config, tables, indexes);

  it('List', () => {
    const res = tj.index('sampleTable').list;
    assert(compare(LIST, res.params));
  });

  it('Create', () => {
    const res = tj.index('sampleTable')
      .indexName('sampleIndex')
      .create;
    assert(compare(CREATE, res.params));
  });

  it('Describe', () => {
    const res = tj.index('sampleTable')
      .indexName('sampleIndex')
      .describe;
    assert(compare(DESCRIBE, res.params));
  });

  it('Delete', () => {
    const res = tj.index('sampleTable')
      .indexName('sampleIndex')
      .delete;
    assert(compare(DELETE, res.params) && indexes.length === 0);
  });
});
