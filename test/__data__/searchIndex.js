const TableStore = require('tablestore');

exports.LIST = {
  tableName: 'sampleTable',
};

exports.CREATE = {
  tableName: 'sampleTable',
  indexName: 'sampleIndex',
  schema: {
    fieldSchemas: [
      {
        fieldName: 'Col_Keyword',
        fieldType: TableStore.FieldType.KEYWORD,
        index: true,
        enableSortAndAgg: true,
        store: false,
        isAnArray: false,
      },
      {
        fieldName: 'Col_Long',
        fieldType: TableStore.FieldType.LONG,
        index: true,
        enableSortAndAgg: true,
        store: true,
        isAnArray: false,
      },
      {
        fieldName: 'Col_Text',
        fieldType: TableStore.FieldType.TEXT,
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
            order: TableStore.SortOrder.SORT_ORDER_ASC,
          },
        },
        {
          fieldSort: {
            fieldName: 'Col_Keyword',
            order: TableStore.SortOrder.SORT_ORDER_DESC,
          },
        },
      ],
    },
  },
};

exports.DESCRIBE = {
  tableName: 'sampleTable',
  indexName: 'sampleIndex',
};

exports.DELETE = {
  tableName: 'sampleTable',
  indexName: 'sampleIndex',
};
