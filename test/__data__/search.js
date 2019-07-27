const TableStore = require('tablestore');

const TABLE_NAME = 'sampleTable';
const INDEX_NAME = 'sampleIndex';

exports.TERM_QUERY = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.TERM_QUERY,
      query: {
        fieldName: 'Col_Keyword',
        term: 'hangzhou',
      },
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_ALL,
  },
};

exports.TERMS_QUERY = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.TERMS_QUERY,
      query: {
        fieldName: 'Col_Keyword',
        terms: ['hangzhou', 'shanghai'],
      },
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_ALL,
  },
};

exports.MATCH_ALL_QUERY = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.MATCH_ALL_QUERY,
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_SPECIFIED,
    returnNames: ['Col_1', 'Col_2', 'Col_3'],
  },
};

exports.MATCH_QUERY = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.MATCH_QUERY,
      query: {
        fieldName: 'Col_Keyword',
        text: 'hangzhou',
      },
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_ALL,
  },
};

exports.MATCH_PHRASE_QUERY = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.MATCH_PHRASE_QUERY,
      query: {
        fieldName: 'Col_Text',
        text: 'hangzhou shanghai',
      },
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_ALL,
  },
};

exports.PREFIX_QUERY = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.PREFIX_QUERY,
      query: {
        fieldName: 'Col_Keyword',
        prefix: 'hang',
      },
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_ALL,
  },
};

exports.RANGE_QUERY = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.RANGE_QUERY,
      query: {
        fieldName: 'Col_Long',
        rangeFrom: 1,
        includeLower: true,
        rangeTo: 10,
        includeUpper: false,
      },
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_ALL,
  },
};

exports.WILDCARD_QUERY = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.WILDCARD_QUERY,
      query: {
        fieldName: 'Col_Keyword',
        value: 'table*e',
      },
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_ALL,
  },
};

exports.GEO_BOUNDING_BOX_QUERY = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.GEO_BOUNDING_BOX_QUERY,
      query: {
        fieldName: 'Col_GeoPoint',
        topLeft: '10,0',
        bottomRight: '0,10',
      },
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_ALL,
  },
};

exports.GEO_DISTANCE_QUERY = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.GEO_DISTANCE_QUERY,
      query: {
        fieldName: 'Col_GeoPoint',
        centerPoint: '1,1',
        distance: 10000,
      },
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_ALL,
  },
};

exports.GEO_POLYGON_QUERY = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.GEO_POLYGON_QUERY,
      query: {
        fieldName: 'Col_GeoPoint',
        points: ['0,0', '5,5', '5,0'],
      },
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_ALL,
  },
};

exports.NESTED_QUERY = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.NESTED_QUERY,
      query: {
        path: 'Col_Nested',
        query: {
          queryType: TableStore.QueryType.TERM_QUERY,
          query: {
            fieldName: 'Col_Nested.Sub_Col_Keyword',
            term: 'hangzhou',
          },
        },
      },
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_ALL,
  },
};

exports.BOOL_QUERY = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.BOOL_QUERY,
      query: {
        mustQueries: [
          {
            queryType: TableStore.QueryType.RANGE_QUERY,
            query: {
              fieldName: 'Col_Long',
              rangeFrom: 3,
              includeLower: true,
            },
          },
          {
            queryType: TableStore.QueryType.TERM_QUERY,
            query: {
              fieldName: 'Col_Keyword',
              term: 'hangzhou',
            },
          },
        ],
        minimumShouldMatch: 1,
      },
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_ALL,
  },
};

exports.SCORE_SORT = {
  sorters: [
    {
      scoreSort: {
        order: TableStore.SortOrder.SORT_ORDER_ASC,
      },
    },
  ],
};

exports.PRIMARY_KEY_SORT = {
  sorters: [
    {
      primaryKeySort: {
        order: TableStore.SortOrder.SORT_ORDER_DESC,
      },
    },
  ],
};

exports.FIELD_SORT = {
  sorters: [
    {
      fieldSort: {
        fieldName: 'Col_Keyword',
        order: TableStore.SortOrder.SORT_ORDER_DESC,
      },
    },
    {
      fieldSort: {
        fieldName: 'Col_Long',
        order: TableStore.SortOrder.SORT_ORDER_DESC,
      },
    },
  ],
};

exports.GEO_DISTANCE_SORT = {
  sorters: [
    {
      geoDistanceSort: {
        fieldName: 'Col_Geo_Point',
        points: ['0,0'],
        order: TableStore.SortOrder.SORT_ORDER_ASC,
      },
    },
  ],
};

exports.FLIP_OFFSET = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 90,
    limit: 10,
    query: {
      queryType: TableStore.QueryType.MATCH_ALL_QUERY,
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_ALL,
  },
};

exports.FLIP_TOKEN = {
  tableName: TABLE_NAME,
  indexName: INDEX_NAME,
  searchQuery: {
    offset: 0,
    limit: 10,
    token: null,
    query: {
      queryType: TableStore.QueryType.MATCH_ALL_QUERY,
    },
    getTotalCount: true,
  },
  columnToGet: {
    returnType: TableStore.ColumnReturnType.RETURN_SPECIFIED,
    returnNames: ['pic_tag', 'pic_description', 'time', 'pos'],
  },
};
