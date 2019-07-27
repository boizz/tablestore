const proxyquire = require('proxyquire');
const assert = require('power-assert');

const mockTableStore = require('../__mock__/tablestore');
const { compare } = require('../__utils__/data');
const {
  TERM_QUERY,
  TERMS_QUERY,
  MATCH_ALL_QUERY,
  MATCH_QUERY,
  MATCH_PHRASE_QUERY,
  PREFIX_QUERY,
  RANGE_QUERY,
  WILDCARD_QUERY,
  GEO_BOUNDING_BOX_QUERY,
  GEO_DISTANCE_QUERY,
  GEO_POLYGON_QUERY,
  NESTED_QUERY,
  BOOL_QUERY,

  SCORE_SORT,
  PRIMARY_KEY_SORT,
  FIELD_SORT,
  GEO_DISTANCE_SORT,

  FLIP_OFFSET,
  FLIP_TOKEN,
} = require('../__data__/search');

const {
  // TJ,
  BoolQueryType,
  QueryType,
  SortOrder,
} = require('../../index');

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

const TABLE_NAME = 'sampleTable';
const INDEX_NAME = 'sampleIndex';

describe('Search', () => {
  const tj = new TJ(config, tables, indexes);

  it('Term query', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .query([{
        queryType: QueryType.TERM_QUERY,
        fieldName: 'Col_Keyword',
        value: 'hangzhou',
      }]);
    assert(compare(TERM_QUERY, res.params));
  });

  it('Terms query', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .query([{
        queryType: QueryType.TERMS_QUERY,
        fieldName: 'Col_Keyword',
        value: ['hangzhou', 'shanghai'],
      }]);
    assert(compare(TERMS_QUERY, res.params));
  });

  it('Match all query', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .returnFields(['Col_1', 'Col_2', 'Col_3'])
      .query([{
        queryType: QueryType.MATCH_ALL_QUERY,
      }]);
    assert(compare(MATCH_ALL_QUERY, res.params));
  });

  it('Match query', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .query([{
        queryType: QueryType.MATCH_QUERY,
        fieldName: 'Col_Keyword',
        value: 'hangzhou',
      }]);
    assert(compare(MATCH_QUERY, res.params));
  });

  it('Match phrase query', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .query([{
        queryType: QueryType.MATCH_PHRASE_QUERY,
        fieldName: 'Col_Text',
        value: 'hangzhou shanghai',
      }]);
    assert(compare(MATCH_PHRASE_QUERY, res.params));
  });

  it('Prefix query', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .query([{
        queryType: QueryType.PREFIX_QUERY,
        fieldName: 'Col_Keyword',
        value: 'hang',
      }]);
    assert(compare(PREFIX_QUERY, res.params));
  });

  it('Range query', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .query([{
        queryType: QueryType.RANGE_QUERY,
        fieldName: 'Col_Long',
        options: {
          rangeFrom: 1,
          includeLower: true,
          rangeTo: 10,
          includeUpper: false,
        },
      }]);
    assert(compare(RANGE_QUERY, res.params));
  });

  it('Wildcard query', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .query([{
        queryType: QueryType.WILDCARD_QUERY,
        fieldName: 'Col_Keyword',
        value: 'table*e',
      }]);
    assert(compare(WILDCARD_QUERY, res.params));
  });

  it('Geo bounding box query', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .query([{
        queryType: QueryType.GEO_BOUNDING_BOX_QUERY,
        fieldName: 'Col_GeoPoint',
        options: {
          topLeft: '10,0',
          bottomRight: '0,10',
        },
      }]);
    assert(compare(GEO_BOUNDING_BOX_QUERY, res.params));
  });

  it('Geo distance query', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .query([{
        queryType: QueryType.GEO_DISTANCE_QUERY,
        fieldName: 'Col_GeoPoint',
        options: {
          centerPoint: '1,1',
          distance: 10000,
        },
      }]);
    assert(compare(GEO_DISTANCE_QUERY, res.params));
  });

  it('Geo polygon query', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .query([{
        queryType: QueryType.GEO_POLYGON_QUERY,
        fieldName: 'Col_GeoPoint',
        options: {
          points: ['0,0', '5,5', '5,0'],
        },
      }]);
    assert(compare(GEO_POLYGON_QUERY, res.params));
  });

  it('Nested query', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .query([{
        queryType: QueryType.TERM_QUERY,
        fieldName: 'Col_Nested.Sub_Col_Keyword',
        value: 'hangzhou',
      }]);
    assert(compare(NESTED_QUERY, res.params));
  });

  it('Bool query', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .boolType(BoolQueryType.MUST_QUERIES)
      .minimumShouldMatch(1)
      .query([
        {
          queryType: QueryType.RANGE_QUERY,
          fieldName: 'Col_Long',
          options: {
            rangeFrom: 3,
            includeLower: true,
          },
        },
        {
          queryType: QueryType.TERM_QUERY,
          fieldName: 'Col_Keyword',
          value: 'hangzhou',
        },
      ]);
    assert(compare(BOOL_QUERY, res.params));
  });

  it('Score sort', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .scoreSort(SortOrder.ASC)
      .query();
    assert(compare(SCORE_SORT, res.params));
  });

  it('Primary key sort', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .primaryKeySort(SortOrder.DESC)
      .query();
    assert(compare(PRIMARY_KEY_SORT, res.params));
  });

  it('Field sort', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .fieldSort({
        Col_Keyword: SortOrder.DESC,
        Col_Long: SortOrder.DESC,
      })
      .query();
    assert(compare(FIELD_SORT, res.params));
  });

  it('Geo distance sort', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .geoDistanceSort({
        fieldName: 'Col_Geo_Point',
        points: ['0,0'],
        order: SortOrder.ASC,
      })
      .query();
    assert(compare(GEO_DISTANCE_SORT, res.params));
  });

  it('Flip offset', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(90)
      .limit(10)
      .query([{
        queryType: QueryType.MATCH_ALL_QUERY,
      }]);
    assert(compare(FLIP_OFFSET, res.params));
  });

  it('Flip token', async () => {
    const res = await tj.search(TABLE_NAME)
      .indexName(INDEX_NAME)
      .offset(0)
      .limit(10)
      .token(null)
      .returnFields(['pic_tag', 'pic_description', 'time', 'pos'])
      .query([{
        queryType: QueryType.MATCH_ALL_QUERY,
      }]);
    assert(compare(FLIP_TOKEN, res.params));
  });
});
