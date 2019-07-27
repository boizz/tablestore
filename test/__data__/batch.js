const TableStore = require('tablestore');

const { Long } = TableStore;

const { RowExistenceExpectation, ReturnType, INF } = require('../../index');

exports.GET_ROW = {
  sample: {
    tables: [{
      tableName: 'sampleTable',
      primaryKey: [
        [{ gid: Long.fromNumber(20013) }, { uid: Long.fromNumber(20013) }],
        [{ gid: Long.fromNumber(20015) }, { uid: Long.fromNumber(20015) }],
      ],
      startColumn: 'col2',
      endColumn: 'col4',
    },
    {
      tableName: 'notExistTable',
      primaryKey: [
        [{ gid: Long.fromNumber(10001) }, { uid: Long.fromNumber(10001) }],
      ],
    }],
  },
  target: [
    {
      tableName: 'sampleTable',
      primaryKey: [
        { gid: 20013, uid: 20013 },
        { gid: 20015, uid: 20015 },
      ],
      startColumn: 'col2',
      endColumn: 'col4',
    },
    {
      tableName: 'notExistTable',
      primaryKey: [{ gid: 10001, uid: 10001 }],
    },
  ],
};

exports.WHITE_ROW = {
  sample: {
    tables: [{
      tableName: 'sampleTable',
      rows: [{
        type: 'PUT',
        condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
        primaryKey: [{ gid: Long.fromNumber(8) }, { uid: Long.fromNumber(80) }],
        attributeColumns: [{ attrCol1: 'test1' }, { attrCol2: 'test2' }],
        returnContent: { returnType: TableStore.ReturnType.Primarykey },
      }],
    }],
  },
  target: [{
    tableName: 'sampleTable',
    rows: [{
      type: 'PUT',
      rowExistenceExpectation: RowExistenceExpectation.IGNORE,
      returnType: ReturnType.Primarykey,
      rowChange: {
        gid: 8,
        uid: 80,
        attrCol1: 'test1',
        attrCol2: 'test2',
      },
    }],
  }],
};

exports.GET_RANGE = {
  sample: {
    tableName: 'sampleTable',
    direction: TableStore.Direction.FORWARD,
    inclusiveStartPrimaryKey: [{ gid: TableStore.INF_MIN }, { uid: TableStore.INF_MIN }],
    exclusiveEndPrimaryKey: [{ gid: TableStore.INF_MAX }, { uid: TableStore.INF_MAX }],
    limit: 50,
  },
  target: {
    tableName: 'sampleTable',
    direction: TableStore.Direction.FORWARD,
    inclusiveStartPrimaryKey: {
      gid: INF.MIN,
      uid: INF.MIN,
    },
    exclusiveEndPrimaryKey: {
      gid: INF.MAX,
      uid: INF.MAX,
    },
    limit: 50,
  },
};
