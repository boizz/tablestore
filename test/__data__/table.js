exports.CREATE = {
  tableMeta: {
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
  reservedThroughput: {
    capacityUnit: {
      read: 0,
      write: 0,
    },
  },
  tableOptions: {
    timeToLive: -1,
    maxVersions: 1,
  },
};

exports.UPDATE = {
  tableName: 'sampleTable',
  tableOptions: {
    maxVersions: 5,
  },
};

exports.DESCRIBE = {
  tableName: 'sampleTable',
};

exports.DELETE = {
  tableName: 'sampleTable',
};
