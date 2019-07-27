const { RETURN_SPECIFIED, RETURN_NONE, RETURN_ALL } = require('../const/columnReturnType');
const { MUST_QUERIES } = require('../const/boolQueryType');
const { SORT_PARAMS_TRANSFORM } = require('../utils/searchParamsTransform');
const { TRANSFORM_RETURN } = require('../utils/dataTransform');
const {
  MATCH_QUERY,
  MATCH_PHRASE_QUERY,
  TERM_QUERY,
  PREFIX_QUERY,
  BOOL_QUERY,
  NESTED_QUERY,
  WILDCARD_QUERY,
  TERMS_QUERY,
} = require('../const/queryType');

function getQuery(obj) {
  const valueNames = {
    [MATCH_QUERY]: 'text',
    [MATCH_PHRASE_QUERY]: 'text',
    [TERM_QUERY]: 'term',
    [TERMS_QUERY]: 'terms',
    [PREFIX_QUERY]: 'prefix',
    [WILDCARD_QUERY]: 'value',
  };
  if (/.+\..+/.test(obj.fieldName)) {
    const fields = obj.fieldName.split('.');
    return {
      queryType: NESTED_QUERY,
      query: {
        path: fields[0],
        query: {
          queryType: obj.queryType,
          query: {
            fieldName: obj.fieldName,
            [valueNames[obj.queryType] || 'value']: obj.value,
            ...obj.options,
          },
        },
      },
    };
  }
  return {
    queryType: obj.queryType,
    query: {
      fieldName: obj.fieldName,
      [valueNames[obj.queryType] || 'value']: obj.value,
      ...obj.options,
    },
  };
}

class Search {
  constructor(client) {
    this.client = client;

    this._get_total_count = true;
    this._column_to_get = {
      returnType: RETURN_ALL,
    };
    this._bool_type = MUST_QUERIES;
  }

  /**
   * 指定表
   * @param {tableName} tableName 表名
   */
  tableName(tableName) {
    this._table_name = tableName;
    return this;
  }

  /**
   * 指定索引
   * @param {tableName} tableName 索引名
   */
  indexName(indexName) {
    this._index_name = indexName;
    return this;
  }


  /**
   * @param {Number} offset
   */
  offset(offset) {
    this._offset = offset;
    return this;
  }

  /**
   * @param {Number} limit
   */
  limit(limit) {
    this._limit = limit;
    return this;
  }

  /**
   * @param {*} token
   */
  token(token) {
    this._token = token;
    return this;
  }

  /**
   * 是否返回数据的总行数，默认返回
   * @param {Boolean} getTotalCount
   */
  getTotalCount(getTotalCount) {
    this._get_total_count = getTotalCount;
    return this;
  }

  /**
   * 返回列设置
   * @param {String[]} returnFields 默认返回全部，不传值或传空数组不返回
   */
  returnFields(returnFields = []) {
    if (returnFields.length) {
      this._column_to_get = {
        returnType: RETURN_SPECIFIED,
        returnNames: returnFields,
      };
    } else {
      this._column_to_get = {
        returnType: RETURN_NONE,
      };
    }
    return this;
  }

  /**
   * 分数排序
   * @param {Number} order 排序方式 (正序、逆序)
   */
  scoreSort(order) {
    this._sorters = [
      {
        scoreSort: {
          order,
        },
      },
    ];
    return this;
  }

  /**
   * 表主键排序
   * @param {Number} order 排序方式 (正序、逆序)
   */
  primaryKeySort(order) {
    this._sorters = [
      {
        primaryKeySort: {
          order,
        },
      },
    ];
    return this;
  }

  /**
   * 地理距离排序
   * @param {Object} options
   * @param {Object} options.fieldName 字段名
   * @param {Object} options.points 中心点
   * @param {Object} options.order 距离中心点排序方式 (正序、逆序)
   */
  geoDistanceSort(options) {
    this._sorters = [
      {
        geoDistanceSort: options,
      },
    ];
    return this;
  }

  /**
   * 按照某一列的值进行排序
   * @param {Object} fieldOrder
   * @param {Number} fieldOrder[fieldName] 排序方式 (正序、逆序)
   */
  fieldSort(fieldOrder) {
    const sorters = SORT_PARAMS_TRANSFORM(fieldOrder);
    this._sorters = sorters;
    return this;
  }

  /**
   * 组合查询方式
   * @param {String} queriesType mustQueries, shouldQueries, mustNotQueries, filterQueries
   */
  boolType(boolType) {
    this._bool_type = boolType;
    return this;
  }

  /**
   * 至少满足几个shouldQueries子句
   * @param {Number} minimumShouldMatch
   */
  minimumShouldMatch(minimumShouldMatch) {
    this._minimum_should_match = minimumShouldMatch;
    return this;
  }

  /**
   * 多元索引查询
   * @param {Object[]} queries 搜索参数集
   * @param {Number} queries[].queryType 搜索类型
   * @param {String} queries[].fieldName 字段名
   * @param {String} queries[].value 搜索内容
   * @param {Object} queries[].options 搜索项 (范围查询、地理位置查询)
   * @param {Number} queries[].options.from 起始位置的值
   * @param {Number} queries[].options.to 结束位置的值
   * @param {Boolean} queries[].options.includeLow 结果中是否需要包括 from 值
   * @param {Boolean} queries[].options.includeUpper 结果中是否需要包括 to 值
   * @param {String} queries[].options.topLeft 矩形框的左上角的坐标 (纬度,经度)
   * @param {String} queries[].options.bottomRight 矩形框的右下角的坐标 (纬度,经度)
   * @param {String} queries[].options.centerPoint 中心地理坐标点，是一个经纬度值
   * @param {Number} queries[].options.distance 距离中心点的距离，单位是米
   * @param {String[]} queries[].options.points 组成多边形的距离坐标点
   */
  async query(queries = []) {
    const params = this._getParams();
    if (Array.isArray(queries)) {
      if (queries.length === 1) {
        params.searchQuery.query = getQuery(queries[0]);
      } else {
        const query = {
          queryType: BOOL_QUERY,
          query: {
            [this._bool_type]: [],
            minimumShouldMatch: this._minimum_should_match,
          },
        };
        queries.forEach((q) => {
          query.query[this._bool_type].push(getQuery(q));
        });
        params.searchQuery.query = query;
      }
    }
    const res = await this.client.search(params);
    return TRANSFORM_RETURN(res);
  }

  _getParams() {
    const params = {
      tableName: this._table_name,
      indexName: this._index_name,
      searchQuery: {
        offset: this._offset,
        limit: this._limit,
        token: this._token,
        getTotalCount: this._get_total_count,
      },
      columnToGet: this._column_to_get,
      sorters: this._sorters,
    };
    return params;
  }
}

module.exports = Search;
