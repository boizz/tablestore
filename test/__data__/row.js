const TableStore = require('tablestore');

const { Long } = TableStore;

exports.PUT = {
  tableName: 'sampleTable',
  condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
  primaryKey: [{ gid: Long.fromNumber(20013) }, { uid: Long.fromNumber(20013) }],
  attributeColumns: [
    { col1: '表格存储' },
    { col2: '2' },
    { col3: 3.1 },
    { col4: -0.32 },
    { col5: Long.fromNumber(123456789) },
  ],
  returnContent: { returnType: TableStore.ReturnType.Primarykey },
};

exports.GET = {
  tableName: 'sampleTable',
  primaryKey: [{ gid: Long.fromNumber(20004) }, { uid: Long.fromNumber(20004) }],
  maxVersions: 2,
};

exports.UPDATE = {
  tableName: 'sampleTable',
  condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
  primaryKey: [{ gid: Long.fromNumber(9) }, { uid: Long.fromNumber(90) }],
  updateOfAttributeColumns: [
    { PUT: [{ col4: Long.fromNumber(4) }, { col5: '5' }, { col6: Long.fromNumber(6) }] },
    { DELETE: [{ col1: Long.fromNumber(1496826473186) }] },
    { DELETE_ALL: ['col2'] },
  ],
};

exports.DELETE = {
  tableName: 'sampleTable',
  condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
  primaryKey: [{ gid: Long.fromNumber(8) }, { uid: Long.fromNumber(80) }],
};
