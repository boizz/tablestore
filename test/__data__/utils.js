const TableStore = require('tablestore');

const { Long } = TableStore;

exports.RETURN = {
  simple: {
    rows: [
      {
        primaryKey: [
          {
            name: 'gid',
            value: Long.fromNumber(20013),
          },
          {
            name: 'uid',
            value: Long.fromNumber(20018),
          },
        ],
        attributes: [
          {
            columnName: 'col1',
            columnValue: '表格存储',
            timestamp: 1564290238349,
          },
          {
            columnName: 'col2',
            columnValue: '2',
            timestamp: 1564290238349,
          },
          {
            columnName: 'col3',
            columnValue: 3.1,
            timestamp: 1564290238349,
          },
          {
            columnName: 'col4',
            columnValue: -0.32,
            timestamp: 1564290238349,
          },
          {
            columnName: 'col5',
            columnValue: Long.fromNumber(123456789),
            timestamp: 1564290238349,
          },
        ],
      },
    ],
  },
  target: {
    data: [
      {
        gid: 20013,
        uid: 20018,
        col1: '表格存储',
        col2: '2',
        col3: 3.1,
        col4: -0.32,
        col5: 123456789,
      },
    ],
  },
};
