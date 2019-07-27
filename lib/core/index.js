const TableStore = require('tablestore');

const Table = require('./table');
const SearchIndex = require('./searchIndex');
const Row = require('./row');
const Search = require('./search');
const Batch = require('./batch');

class TJ {
  /**
   * 初始化
   * @param {Object} config 表格储存配置
   * @param {String} config.accessKeyId
   * @param {String} config.accessKeySecret
   * @param {String} config.stsToken
   * @param {String} config.endpoint
   * @param {String} config.instancename
   * @param {Number} config.maxRetries 重试次数，默认 20 次
   * @param {Object[]} tables 所有表格的 MetaData 集合
   * @param {String} tables[].tableName
   * @param {Object[]} tables[].primaryKey
   * @param {String} tables[].primaryKey[].name
   * @param {String} tables[].primaryKey[].type
   * @param {String} tables[].primaryKey[].option
   * @param {Object[]} indexes 所有多元索引的配置集合
   * @param {String} indexes[].tableName
   * @param {String} indexes[].indexName
   * @param {Object} indexes[].schema
   * @param {Object[]} indexes[].schema.fieldSchemas
   * @param {String} indexes[].schema.fieldSchemas[].fieldName
   * @param {Number} indexes[].schema.fieldSchemas[].fieldType
   * @param {Boolean} indexes[].schema.fieldSchemas[].index
   * @param {Boolean} indexes[].schema.fieldSchemas[].enableSortAndAgg
   * @param {Boolean} indexes[].schema.fieldSchemas[].store
   * @param {Boolean} indexes[].schema.fieldSchemas[].isAnArray
   * @param {Object} indexes[].schema.indexSetting
   * @param {String[]} indexes[].schema.indexSetting.routingFields
   * @param {Number} indexes[].schema.indexSetting.routingPartitionSize
   * @param {Object} indexes[].schema.indexSort
   * @param {Object[]} indexes[].schema.indexSort.sorters
   * @param {Object} indexes[].schema.indexSort.sorters.primaryKeySort
   * @param {Object} indexes[].schema.indexSort.sorters.fieldSort
   */
  constructor(config, tables, indexes) {
    this.client = new TableStore.Client(config);
    this._tables = tables;
    this._indexes = indexes;
    this.data = {};
  }

  /**
   * 表操作
   * @param {String} tableName 表名称
   */
  table(tableName) {
    const table = new Table(this.client, this._tables);
    return table.tableName(tableName);
  }

  /**
   * 多元索引操作
   * @param {String} tableName 表名称
   */
  index(tableName) {
    const searchIndex = new SearchIndex(this.client, this._indexes);
    return searchIndex.tableName(tableName);
  }

  /**
   * 单行数据操作
   * @param {String} tableName 表名称
   */
  row(tableName) {
    const row = new Row(this.client, this._tables);
    return row.tableName(tableName);
  }

  /**
   * 多行数据操作
   */
  get batch() {
    return new Batch(this.client, this._tables);
  }

  /**
   * 多元索引查询操作
   * @param {String} tableName 表名称
   */
  search(tableName) {
    const search = new Search(this.client);
    return search.tableName(tableName);
  }
}

module.exports = TJ;
